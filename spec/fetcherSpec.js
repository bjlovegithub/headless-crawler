const fetcher = require("../fetcher/fetcher.js")

console.log(fetcher)

describe("Fetcher", function() {
  describe("getXpathConf", function() {
    it("return the conf for test.abc.com", function() {
	  const url = "http://test.abc.com/get?id=123"
	  const xpath_conf = {"test.abc.com": "xpath_conf"}
	  expect(fetcher.getXpathConf(url, xpath_conf)).toBe("xpath_conf")
    });

    it("return undefined for invalid url", function() {
	  const url = "get?id=123"
	  const xpath_conf = {"test.abc.com": "xpath_conf"}
	  expect(fetcher.getXpathConf(url, xpath_conf)).toBe(undefined)
    });

	it("return undefined for valid url if no xpath conf for the host", function() {
	  const url = "http://test.abc.com/get?id=123"
	  const xpath_conf = {"www.abc.com": "xpath_conf"}
	  expect(fetcher.getXpathConf(url, xpath_conf)).toBe(undefined)
    });

  });
});


