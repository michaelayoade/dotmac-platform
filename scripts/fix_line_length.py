#!/usr/bin/env python3
"""
Line Length Fixer

This script automatically fixes line length issues in Python files
by breaking long lines according to PEP 8 guidelines.
"""

import re
import sys
from pathlib import Path


def fix_line_length(file_path, max_length=88):
    """
    Fix lines that exceed the maximum length in a Python file.

    Args:
        file_path: Path to the Python file
        max_length: Maximum line length (default: 88 for Black)

    Returns:
        bool: True if changes were made, False otherwise
    """
    with open(file_path, "r") as f:
        lines = f.readlines()

    fixed_lines = []
    changes_made = False

    for line in lines:
        if len(line.rstrip()) > max_length:
            # Try to fix the line
            fixed_line = fix_single_line(line, max_length)
            fixed_lines.append(fixed_line)
            if fixed_line != line:
                changes_made = True
        else:
            fixed_lines.append(line)

    if changes_made:
        with open(file_path, "w") as f:
            f.writelines(fixed_lines)
        print(f"Fixed line length issues in {file_path}")

    return changes_made


def fix_single_line(line, max_length):
    """
    Fix a single line that exceeds the maximum length.

    This function tries to intelligently break the line at appropriate points:
    - After commas in function arguments
    - Before operators in expressions
    - After opening parentheses

    Args:
        line: The line to fix
        max_length: Maximum line length

    Returns:
        str: The fixed line, potentially with line breaks
    """
    line = line.rstrip()
    if len(line) <= max_length:
        return line + "\n"

    # Determine indentation
    indent = len(line) - len(line.lstrip())
    indent_str = " " * indent

    # Check if it's a string that can be split
    if ('"' in line or "'" in line) and "f" in line[: indent + 1]:
        # Handle f-strings by splitting at appropriate points
        return fix_fstring(line, indent_str, max_length)

    # Check if it's a function call or definition
    if "(" in line and ")" in line:
        return fix_function_call(line, indent_str, max_length)

    # Default: just split at max_length and add continuation indent
    continuation_indent = indent_str + "    "
    return (
        line[:max_length]
        + "\n"
        + continuation_indent
        + line[max_length:]
        + "\n"
    )


def fix_fstring(line, indent_str, max_length):
    """Fix an f-string that exceeds the maximum length."""
    # Split at spaces if possible
    parts = line.split(" ")
    result = ""
    current_line = ""

    for part in parts:
        if len(current_line) + len(part) + 1 <= max_length:
            if current_line:
                current_line += " " + part
            else:
                current_line = part
        else:
            result += current_line + "\n"
            current_line = indent_str + "    " + part

    if current_line:
        result += current_line + "\n"

    return result


def fix_function_call(line, indent_str, max_length):
    """Fix a function call or definition that exceeds the maximum length."""
    # Find the opening parenthesis
    open_paren_idx = line.find("(")
    if open_paren_idx == -1:
        return line + "\n"

    # Split at commas
    prefix = line[: open_paren_idx + 1]
    content = line[open_paren_idx + 1 :]

    # Handle case where there's no closing parenthesis
    close_paren_idx = content.rfind(")")
    suffix = ""
    if close_paren_idx != -1:
        suffix = content[close_paren_idx:]
        content = content[:close_paren_idx]

    # Split at commas
    parts = re.split(r"(,\s*)", content)

    result = prefix + "\n"
    current_line = indent_str + "    "

    for i in range(0, len(parts), 2):
        part = parts[i]
        delimiter = parts[i + 1] if i + 1 < len(parts) else ""

        if len(current_line) + len(part) + len(delimiter) <= max_length - 4:
            current_line += part + delimiter
        else:
            result += current_line + "\n"
            current_line = indent_str + "    " + part + delimiter

    if current_line.strip():
        result += current_line + "\n"

    result += indent_str + suffix + "\n"
    return result


def main():
    """Main entry point for the script."""
    if len(sys.argv) < 2:
        print("Usage: python fix_line_length.py <file_paths...>")
        return 1

    files_to_fix = []
    for path_str in sys.argv[1:]:
        path = Path(path_str)
        if path.is_file() and path.suffix == ".py":
            files_to_fix.append(path)
        elif path.is_dir():
            files_to_fix.extend(path.glob("**/*.py"))

    fixed_count = 0
    for file_path in files_to_fix:
        if fix_line_length(file_path):
            fixed_count += 1

    print(f"Fixed {fixed_count} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
