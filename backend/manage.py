#!/usr/bin/env python
"""
This script serves as the entry point for administrative tasks in a Django project.

It sets the default Django settings module to 'dagbok.settings' and attempts to
execute command-line tasks using Django's management utility.

Functions:
    main(): Sets the DJANGO_SETTINGS_MODULE environment variable and executes
            Django's command-line utility for administrative tasks.

Usage:
    Run this script from the command line to perform various Django administrative
    tasks, such as running the development server, applying migrations, and more.

Example:
    $ python manage.py runserver

Raises:
    ImportError: If Django is not installed or not available on the PYTHONPATH
                 environment variable, or if the virtual environment is not activated.
"""

import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dagbok.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
