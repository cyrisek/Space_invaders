from django.db import models

# Create your models here.


class Score(models.Model):
    name = models.CharField(max_length=25, default='')
    number = models.IntegerField()

    def __int__(self):
        return self.number
