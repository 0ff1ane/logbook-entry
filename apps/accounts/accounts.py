from .models import CustomUser as User

class Accounts:
    @staticmethod
    def get_user_by_id(user_id: int):
        return User.objects.filter(id=user_id).first()

    @staticmethod
    def get_user_by_email(email: str):
            return User.objects.filter(email=email).first()

    @staticmethod
    def create_user(email, password, name, initials):
        user = User.objects.create_user(username=email, email=email, password=password, name=name, initials=initials)
        return user
