# users_app/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    agree_to_terms = serializers.BooleanField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "username",
            "password",
            "password_confirm",
            "agree_to_terms",
        ]

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Password fields didn't match."}
            )
        if not attrs.get("agree_to_terms"):
            raise serializers.ValidationError(
                {"agree_to_terms": "You must agree to the terms."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        validated_data.pop("agree_to_terms")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


User = get_user_model()


class EmailTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        # 1️⃣ Busque o usuário
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("Credenciais inválidas")

        # 2️⃣ Verifique senha e ativo
        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Credenciais inválidas")
        if not user.is_active:
            raise exceptions.AuthenticationFailed("Usuário inativo")

        # 3️⃣ Gere manualmente os tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # 4️⃣ Monte o payload de resposta
        return {
            "refresh": str(refresh),
            "access": str(access),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
        }
