from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
from django.conf import settings


class RegisterView(APIView):
    permission_classes = []  # Allow any
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )

class EmailCookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

    # sem autenticação prévia
    permission_classes: list = []
    authentication_classes: list = []

    def post(self, request, *args, **kwargs):
        # chama a implementação original (gera access/refresh e devolve Response)
        response: Response = super().post(request, *args, **kwargs)

        # remove os tokens do corpo…
        access = response.data.pop("access")
        refresh = response.data.pop("refresh")

        # …e grava como cookies HttpOnly
        access_exp = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
        refresh_exp = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()

        response.set_cookie(
            key="access",
            value=access,
            max_age=access_exp,
            httponly=True,
            secure=not settings.DEBUG,  # só HTTPS em produção
            samesite="Lax",
            path="/",
        )
        response.set_cookie(
            key="refresh",
            value=refresh,
            max_age=refresh_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/api/v1/token/refresh/",  # restringe o refresh (opcional)
        )

        # corpo opcional: coloque o que quiser
        response.data["detail"] = "Login realizado com sucesso"
        return response
