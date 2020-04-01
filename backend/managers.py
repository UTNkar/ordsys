from django.contrib.auth.models import BaseUserManager
# Don't explicitly import model classes to avoid circular import errors
from . import models


class UserManager(BaseUserManager):
    def create_user(self, username, password, org):
        organisation = models.Organisation.objects.get(pk=org)
        user = self.model(username=username, org=organisation)
        user.set_password(password)
        return user

    def create_superuser(self, username, password, org):
        user = self.create_user(username, password, org)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user
