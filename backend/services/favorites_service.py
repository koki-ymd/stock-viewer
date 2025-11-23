# backend/services/favorites_service.py
from typing import Dict, List

# user_id -> [symbol, ...]
_FAVORITES_DB: Dict[str, List[str]] = {}


def get_favorites(user_id: str) -> list[str]:
    """
    指定ユーザーのお気に入り銘柄一覧を返す。
    """
    return _FAVORITES_DB.get(user_id, [])


def toggle_favorite(user_id: str, symbol: str) -> list[str]:
    """
    指定ユーザーに対して、お気に入りをトグルする。
    - まだ登録されていなければ追加
    - すでに登録されていれば削除
    変更後の一覧を返す。
    """
    symbols = _FAVORITES_DB.setdefault(user_id, [])

    if symbol in symbols:
        # 削除
        symbols.remove(symbol)
    else:
        # 追加
        symbols.append(symbol)

    return symbols

