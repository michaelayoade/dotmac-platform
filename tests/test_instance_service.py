from app.services.instance_service import _quote_env_value


def test_quote_env_value_escapes_backslashes_before_wrapping():
    value = "pass\\word\\"

    assert _quote_env_value(value) == '"pass\\\\word\\\\"'
