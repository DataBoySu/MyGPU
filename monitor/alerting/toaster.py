"""Windows toast helper for alerts.

This module attempts to use `win10toast` when available but avoids noisy
pkg_resources warnings and the WNDPROC/TypeError by invoking the notifier
in a safe, non-blocking way.
"""
# no dependencies required here
import warnings
import threading

_ToastNotifierClass = None
with warnings.catch_warnings():
    # suppress the known pkg_resources deprecation warning emitted by win10toast
    warnings.simplefilter('ignore')
    try:
        from win10toast import ToastNotifier as _ToastNotifierClass
    except Exception:
        _ToastNotifierClass = None

# Prefer winrt notifications when available (more robust). We'll detect at import time.
_has_winrt = False
try:
    from winrt.windows.ui.notifications import ToastNotificationManager, ToastNotification
    from winrt.windows.data.xml.dom import XmlDocument
    _has_winrt = True
except Exception:
    _has_winrt = False


def _safe_show_toast(notifier, title, msg, duration):
    try:
        # call the blocking API (threaded=False) inside our own thread to
        # avoid the library's internal WNDPROC callback lifecycle issues.
        notifier.show_toast(title, msg, duration=duration, threaded=False)
    except Exception:
        # swallow errors from the underlying notification library
        pass


def _safe_show_toast_win10(title, msg, duration):
    try:
        if _ToastNotifierClass is None:
            return
        n = _ToastNotifierClass()
        n.show_toast(title, msg, duration=duration, threaded=False)
    except Exception:
        pass


def send_toast(title: str, msg: str, duration: int = 5, severity: str = 'info'):
    """Send a Windows toast if possible; otherwise no-op.

    `severity` may be 'info', 'warning', or 'critical'. The UI uses the
    title/message provided and avoids emoji prefixes per user's request.
    """
    try:
        display_title = title
        if severity and severity.lower() in ('critical', 'error'):
            display_title = str(title)
        elif severity and severity.lower() == 'warning':
            display_title = str(title)

        # If winrt is available, use native Windows 10+ notifications (synchronous API)
        if _has_winrt:
            try:
                # build a simple ToastGeneric XML
                def _xml_escape(s):
                    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
                xml = f"<toast><visual><binding template='ToastGeneric'><text>{_xml_escape(display_title)}</text><text>{_xml_escape(msg)}</text></binding></visual></toast>"
                doc = XmlDocument()
                doc.load_xml(xml)
                notif = ToastNotification(doc)
                notifier = ToastNotificationManager.create_toast_notifier()
                notifier.show(notif)
                return True
            except Exception:
                # fall back to win10toast path below
                pass

        if _ToastNotifierClass is not None:
            # instantiate and run the notifier inside a background thread to avoid WNDPROC lifecycle issues
            try:
                threading.Thread(target=_safe_show_toast_win10, args=(display_title, msg, duration), daemon=True).start()
                return True
            except Exception:
                return False
    except Exception:
        pass
    return False
