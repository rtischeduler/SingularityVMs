import os, sys, tempfile, unittest
sys.path.insert(0, os.path.dirname(__file__))
import build_catalog as b
class T(unittest.TestCase):
    def test_parse_and_filter(self):
        d = tempfile.mkdtemp()
        def w(rel, t):
            p = os.path.join(d, rel); os.makedirs(os.path.dirname(p)); open(p, "w").write(t)
        w("software/linux/app-x/index.html", '<title>X - Online in the Cloud</title><a href="/p?os=u-1">')
        w("ar/software/linux/app-y/index.html", "<title>Y</title>")
        w("os-distributions/programs/z-online/index.html", "<title>Z</title>")
        items = b.build(d)
        x = [i for i in items if i["id"] == "app-x"][0]
        self.assertEqual((x["name"], x["os"], x["kind"]), ("X", "u-1", "Software: Linux"))
        self.assertEqual(len(items), 2)
unittest.main()
