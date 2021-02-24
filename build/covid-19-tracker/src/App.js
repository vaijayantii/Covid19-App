import React, {useState, useEffect} from 'react';
import Table from './Table'
import Infobox from './Infobox'
import Map from './Map'
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card, 
  CardContent
} from '@material-ui/core';
import {sortData, prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})  //Individual Country
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  // STATE = How to write a variable in REACT

  //https://disease.sh/v3/covid-19/countries
  //https://disease.sh/v3/covid-19/all
  //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  //USEEFFECT = Runs a piece of code 
  //based on a given condition

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  }, []);

  useEffect(() => {
    //async -> send a request, wait for it, do something with the info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2, //UK, USA
          }));
        const sortedData = sortData(data);
        setTableData(sortedData)
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
 
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then((response) => response.json()).then((data) => {
      setCountry(countryCode);
      //All of the data from country response...
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    })
  };
  console.log('Country Info>>>>>' , countryInfo);
  return (
    <div className="app">
    <div className = "app_left">
      <div className = "app_header">
      {/* Header */}
      {/* Title + Selecting Input from Drop-Down */}
      <h1>COVID19 TRACKER</h1>
      <FormControl className = "app_dropdown">
        <Select
          variant = "outlined"
          onChange = {onCountryChange}
          value = {country}
        >
        <MenuItem value = "worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value = {country.value}>{country.name}</MenuItem>
          ))}
          {/* Loop through all the countries and
          show the drop-down list of the options */}
          {/* <MenuItem value = "worldwide">WorldWide</MenuItem>
          <MenuItem value = "worldwide">Option2</MenuItem>
          <MenuItem value = "worldwide">Option3</MenuItem>
  <MenuItem value = "worldwide">Option4</MenuItem> */}
        </Select>
      </FormControl>
      </div>
      
      {/* Info Boxes */}
      {/* Info Boxes */}
      {/* Info Boxes */}
      <div className = "app_stats">
      <Infobox 
               isRed
               active = { casesType === 'cases'}
               onClick = {e => setCasesType('cases')}
               title = "Coronavirus Cases"
               cases = {prettyPrintStat(countryInfo.todayCases)}
               total = {prettyPrintStat(countryInfo.cases)}/>
      <Infobox
               active = { casesType === 'recovered'}
               onClick = {e => setCasesType('recovered')}
               title = "Recovered"
               cases = {prettyPrintStat(countryInfo.todayRecovered)}
               total = {prettyPrintStat(countryInfo.recovered)}/>
      <Infobox 
               isRed
               active = { casesType === 'deaths'}
               onClick = {e => setCasesType('deaths')}
               title = "Deaths"
               cases = {prettyPrintStat(countryInfo.todayDeaths)}
               total = {prettyPrintStat(countryInfo.deaths)}/>
      </div>
      <Map 
      casesType = {casesType}
      countries = {mapCountries}
      center = {mapCenter} 
      zoom = {mapZoom}
      />
    </div>

    <Card className = "app_right">
      <CardContent>
        {/* Table */}
        <h3>Live cases by country</h3>
        <Table countries = {tableData}/>
        {/* Graph */}
        <h3 className = "app_graphTitle">Worldwide new {casesType}</h3>
        <LineGraph className = "app_graph" casesType = {casesType}/>
      </CardContent>
    </Card>
    </div>

  );
}

export default App;
