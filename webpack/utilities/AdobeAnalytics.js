exports.logPageViewed = function() {

  if (typeof s === "undefined") {
    return;
  }

  s.channel = "SDP-Vocabulary"

  let s3 = s_gi("cdcgovvistorid");
  let sKey, override = {
    fun: "cdcgovvistorid",
    trackingServer: "cdc.112.2o7.net",
    oun: false,
    un: false,
    prop75: "3rd Party",
    eVar75: "3rd Party",
    pageName: window.location.toString()
  };

  s.referrer = document.referrer;
  for (sKey in s) {
    if (s.hasOwnProperty(sKey)) {
      if (override.hasOwnProperty(sKey)) {
        if (override[sKey] !== false) {
          s3[sKey] = override[sKey];
        }
      } else if (!!s[sKey]) {
        s3[sKey] = s[sKey];
      }
    }
  }
  s3.referrer = document.referrer;
  updateVariables(s3);
  s3.t();
}
