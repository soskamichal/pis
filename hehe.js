const fetch = require('fetch')

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/xml");
myHeaders.append("Cookie", "PHPSESSID=d3gj6gntamonk2pvuqeao3712k");

var raw = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/geoservices/citiessk/types\">\n    <soapenv:Header/>\n    <soapenv:Body>\n        <typ:getById>\n            <id>14379</id>\n        </typ:getById>\n    </soapenv:Body>\n</soapenv:Envelope>";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'manual'
};

fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/GeoServices/CitiesSK", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
