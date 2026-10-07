import os
from flask import Flask

from .db import init_app as init_db_app
from .auth import bp as auth_bp
from .views import bp as views_bp
from .admin import bp as admin_bp
from .api import bp as api_bp


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("ROPA_SECRET_KEY", "dev-change-me"),
        DATABASE=os.environ.get(
            "ROPA_DATABASE", os.path.join(app.instance_path, "ropa.sqlite3")
        ),
        MAX_CONTENT_LENGTH=10 * 1024 * 1024,
    )
    if test_config:
        app.config.update(test_config)

    os.makedirs(app.instance_path, exist_ok=True)
    init_db_app(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(views_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(api_bp)

    @app.context_processor
    def inject_globals():
        from .auth import current_user
        from .security import csrf_token

        return {"current_user": current_user(), "csrf_token": csrf_token}

    return app
