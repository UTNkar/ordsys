from django import forms
from django.contrib.auth.password_validation import validate_password


class ModelWithOrganisationForm(forms.ModelForm):
    def save(self, commit=True):
        obj = super().save(commit=False)
        if hasattr(self, 'org'):
            setattr(obj, 'org', self.org)
        if commit:
            obj.save()
        return obj


class UserForm(ModelWithOrganisationForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        if password != confirm_password:
            raise forms.ValidationError('Passwords do not match')
        validate_password(password)
        return confirm_password

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user
