from typing import Literal


Size = Literal["small", "big"]


def order(size: Size) -> None:
    raise NotImplementedError()
