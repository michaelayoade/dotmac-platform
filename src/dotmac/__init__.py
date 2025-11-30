# PEP 420 implicit namespace package
# This file should be empty or minimal to allow namespace sharing
__path__ = __import__('pkgutil').extend_path(__path__, __name__)
