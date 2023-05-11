from django import forms
from .models import Score


class ScoreForm(forms.ModelForm):
    class Meta:
        model = Score
        fields = ['name', 'number']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control col-6 mx-3', 'id': 'username', 'placeholder': 'Your Name'}),
        }

    def clean_number(self):
        number = self.cleaned_data['number']
        if number <= 0:
            raise forms.ValidationError("Score must be more than 0.")
        return number

    def clean_name(self):
        name = self.cleaned_data['name']
        if not name:
            raise forms.ValidationError("Name is required.")
        return name
