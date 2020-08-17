import sys

from django.core import exceptions
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import capfirst

from backend.models import Organisation


class Command(BaseCommand):
    requires_migrations_checks = True

    def handle(self, *args, **options):
        org_data = {'theme': None}
        org_name = None
        org_name_field = Organisation._meta.get_field('name')
        org_theme_field = Organisation._meta.get_field('theme')
        try:
            while org_name is None:
                message = self._get_input_message(org_name_field)
                org_name = self.get_input_data(org_name_field, message)
                if org_name:
                    error_msg = self._validate_org_name(org_name, org_name_field)
                    if error_msg:
                        self.stderr.write(error_msg)
                        org_name = None
            org_data['name'] = org_name
            while org_data['theme'] is None:
                message = self._get_input_message(
                    org_theme_field, default=Organisation.ThemesEnum.UTN, choices=Organisation.ThemesEnum.values
                )
                input_value = self.get_input_data(org_theme_field, message, default=Organisation.ThemesEnum.UTN)
                if input_value in Organisation.ThemesEnum.values:
                    org_data['theme'] = input_value
            created_org = Organisation.objects.create(**org_data)
            if options['verbosity'] >= 1:
                self.stdout.write(f'Organisation with id "{created_org.id}" created successfully!')
        except KeyboardInterrupt:
            self.stderr.write('\nOperation cancelled.')
            sys.exit(1)

    def get_input_data(self, field, message, default=None):
        raw_value = input(message)
        if default and raw_value == '':
            raw_value = default
        try:
            val = field.clean(raw_value, None)
        except exceptions.ValidationError as e:
            self.stderr.write("Error: %s" % ' ; '.join(e.messages))
            val = None
        return val

    def _get_input_message(self, field, default=None, choices=None):
        return '%s%s%s: ' % (
            capfirst(field.verbose_name),
            " (leave blank to use '%s')" % default if default else '',
            ". Choices are: " + ', '.join([choice for choice in choices]) if choices else '',
        )

    def _validate_org_name(self, org_name, org_field):
        try:
            Organisation.objects.get(name__exact=org_name)
        except Organisation.DoesNotExist:
            pass
        else:
            return "Error: An organisation with that name already exists!"
        if not org_name:
            return f'{capfirst(org_field.verbose_field_name)} cannot be blank!'
        try:
            org_field.clean(org_name, None)
        except exceptions.ValidationError as e:
            return '; '.join(e.messages)
