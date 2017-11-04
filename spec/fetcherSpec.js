const fetcher = require("../fetcher/fetcher.js")

describe("Fetcher", function() {
  describe("getXpathConf", function() {
    it("return the conf for test.abc.com", function() {
	  const url = "http://test.abc.com/get?id=123"
	  const xpath_conf = {"test.abc.com": {"conf": "xpath_conf", "last_updated": new Date().getTime()}}
	  fetcher.getXpathConf(url, xpath_conf).then(
		val => expect(val).toBe("xpath_conf"));
    });

    it("return undefined for invalid url", function() {
	  const url = "get?id=123"
	  const xpath_conf = {"test.abc.com": {"conf": "xpath_conf", "last_updated": new Date().getTime()}}
	  fetcher.getXpathConf(url, xpath_conf).then(
		val => expect(val).toBe(undefined));
    });

	it("return undefined for valid url if no xpath conf for the host", function() {
	  const url = "http://test.abc.com/get?id=123"
	  const xpath_conf = {"www.abc.com": {"conf": "xpath_conf", "last_updated": new Date().getTime()}}
	  fetcher.getXpathConf(url, xpath_conf).then(
		val => expect(val).toBe(undefined));
    });

	it("return undefined for valid url if no xpath conf for the host", function() {
	  const url = "http://www.realestate.com.au/get?id=123"
	  const xpath_conf = {"www.abc.com": {"conf": "xpath_conf", "last_updated": new Date().getTime()}}
	  fetcher.getXpathConf(url, xpath_conf).then(
		val => console.log(xpath_conf));
    });
  });
});


