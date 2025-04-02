#!/usr/bin/env python3
"""
SQLAlchemy Style Linter

This script checks Python files for deprecated SQLAlchemy 1.x style patterns
and enforces the use of SQLAlchemy 2.0 style throughout the codebase.

Usage:
    python lint_sqlalchemy_style.py [files...]
"""

import argparse
import ast
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

# Default patterns to search for
DEFAULT_PATTERNS = {
    "import_declarative_base": (
        r"from\s+sqlalchemy\.ext\.declarative\s+import\s+.*declarative_base"
    ),
    "declarative_base_assignment": r"Base\s*=\s*declarative_base\(\)",
    "old_column_style": r"Column\([^,)]+,[^)]+\)",
    "base_inheritance": r"class\s+\w+\(Base\):",
}


def load_config() -> Dict:
    """Load configuration from pyproject.toml if available."""
    try:
        import tomli

        pyproject_path = Path("pyproject.toml")
        if pyproject_path.exists():
            with open(pyproject_path, "rb") as f:
                pyproject = tomli.load(f)
                return pyproject.get("tool", {}).get("sqlalchemy_linter", {})
    except ImportError:
        print("Warning: tomli package not found, using default configuration")
    return {}


def find_python_files(paths: List[str]) -> List[str]:
    """Find all Python files in the given paths."""
    python_files = []
    for path in paths:
        if os.path.isfile(path) and path.endswith(".py"):
            python_files.append(path)
        elif os.path.isdir(path):
            for root, _, files in os.walk(path):
                for file in files:
                    if file.endswith(".py"):
                        python_files.append(os.path.join(root, file))
    return python_files


def check_file_content(
    file_path: str, patterns: Dict[str, str]
) -> List[Tuple[str, int, str]]:
    """
    Check file content for SQLAlchemy style issues.

    Args:
        file_path: Path to the Python file
        patterns: Dictionary of patterns to check for

    Returns:
        List of tuples (file_path, line_number, message)
    """
    issues = []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        lines = content.split("\n")

    # Check for pattern matches
    for pattern_name, pattern in patterns.items():
        for i, line in enumerate(lines):
            if re.search(pattern, line):
                message = (
                    f"Found deprecated SQLAlchemy pattern: {pattern_name}"
                )
                issues.append((file_path, i + 1, message))

    # Use AST to check for more complex patterns
    try:
        tree = ast.parse(content)
        visitor = SQLAlchemyVisitor(file_path)
        visitor.visit(tree)
        issues.extend(visitor.issues)
    except SyntaxError:
        # If there's a syntax error, we can't parse the file
        pass

    return issues


class SQLAlchemyVisitor(ast.NodeVisitor):
    """AST visitor to check for SQLAlchemy style issues."""

    def __init__(self, file_path: str):
        self.file_path = file_path
        self.issues: List[Tuple[str, int, str]] = []
        self.imported_names: Set[str] = set()

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        """Check import statements."""
        if node.module == "sqlalchemy.ext.declarative":
            for name in node.names:
                if name.name == "declarative_base":
                    self.issues.append(
                        (
                            self.file_path,
                            node.lineno,
                            "Using deprecated declarative_base import",
                        )
                    )
                    self.imported_names.add(name.asname or name.name)
        self.generic_visit(node)

    def visit_Assign(self, node: ast.Assign) -> None:
        """Check assignments for Base = declarative_base()."""
        if isinstance(node.value, ast.Call):
            if isinstance(node.value.func, ast.Name):
                if node.value.func.id in self.imported_names:
                    for target in node.targets:
                        if (
                            isinstance(target, ast.Name)
                            and target.id == "Base"
                        ):
                            self.issues.append(
                                (
                                    self.file_path,
                                    node.lineno,
                                    "Using deprecated Base = declarative_base()",
                                )
                            )
        self.generic_visit(node)

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        """Check class definitions for Base inheritance."""
        for base in node.bases:
            if isinstance(base, ast.Name) and base.id == "Base":
                self.issues.append(
                    (
                        self.file_path,
                        node.lineno,
                        "Class inherits from Base instead of BaseModel",
                    )
                )
        self.generic_visit(node)


def main() -> int:
    """Main entry point for the linter."""
    parser = argparse.ArgumentParser(
        description="Check for SQLAlchemy 1.x style patterns in Python files"
    )
    parser.add_argument(
        "paths", nargs="*", help="Files or directories to check"
    )
    parser.add_argument(
        "--config", help="Path to configuration file", default=None
    )
    args = parser.parse_args()

    # Load configuration
    config = load_config()
    patterns = config.get("patterns", DEFAULT_PATTERNS)

    # Get files to check
    paths = args.paths or ["."]
    python_files = find_python_files(paths)

    # Check files
    all_issues = []
    for file_path in python_files:
        issues = check_file_content(file_path, patterns)
        all_issues.extend(issues)

    # Report issues
    for file_path, line_number, message in all_issues:
        print(f"{file_path}:{line_number}: {message}")

    return 1 if all_issues else 0


if __name__ == "__main__":
    sys.exit(main())
