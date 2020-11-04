import React, { Component } from "react";
import Loading from "./Loading";
import axios from "axios";
import CountryTable from "./CountryTable";
import Chart from "./Chart";
import { Search } from "react-bootstrap-icons";

class Covid extends Component {
  state = {
    countries: [],
    filterText: "",
    allCountryTotal: 0,
    allCountryDeath: 0,
    allCountryRecovered: 0,
    allCountryActive: 0,
    selectedCountries: [],
  };

  url =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv";

  async componentDidMount() {
    const response = await axios.get(this.url);
    const rows = response.data.split("\n");

    const countries = [];
    let allCountryTotal = 0;
    let allCountryDeath = 0;
    let allCountryRecovered = 0;
    let allCountryActive = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //splitting on ,
      const countryName = row[0].replace(/"/g, "");
      const total = Number(row[4]);
      const death = Number(row[5]);
      const recover = Number(row[6]);
      const active = Number(row[7]);
      if (countryName !== "") {
        countries.push({
          name: countryName,
          total: total,
          death: death,
          recover: recover,
          active: active,
        });
        allCountryTotal += total;
        allCountryDeath += death;
        allCountryRecovered += recover;
        allCountryActive += active;
      }
    }

    this.setState({ countries, allCountryTotal, allCountryDeath, allCountryRecovered, allCountryActive });
  }

  handleOnRowSelected = (countryToUpdate) => {
    const countries = [...this.state.countries];

    const countryIndex = countries.findIndex(
      (c) => c.name === countryToUpdate.name
    );

    const country = {
      name: countryToUpdate.name,
      total: countryToUpdate.total,
      death: countryToUpdate.death,
      recover: countryToUpdate.recover,
      active: countryToUpdate.active,
      selected: !countryToUpdate.selected,
    };

    countries[countryIndex] = country;

    this.setState({
      countries,
      selectedCountries: countries.filter((c) => c.selected),
    });
  };

  sortByTotal = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryB.total > countryA.total) return 1;
    else if (countryB.total < countryA.total) return -1;
    else return 0;
  };

  handleOnSortByTotal = (event) => {
    this.handleOnSortBy(event, this.sortByTotal);
  };

  sortByDeath = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryB.death > countryA.death) return 1;
    else if (countryB.death < countryA.death) return -1;
    else return 0;
  };

  handleOnSortByDeath = (event) => {
    this.handleOnSortBy(event, this.sortByDeath);
  };

  sortByRecovered = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryB.recover > countryA.recover) return 1;
    else if (countryB.recover < countryA.recover) return -1;
    else return 0;
  };

  handleOnSortByRecovered = (event) => {
    this.handleOnSortBy(event, this.sortByRecovered);
  };

  sortByActive = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryB.active > countryA.active) return 1;
    else if (countryB.active < countryA.active) return -1;
    else return 0;
  };

  handleOnSortByActive = (event) => {
    this.handleOnSortBy(event, this.sortByActive);
  };

  sortByCountryName = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryA.name > countryB.name) return 1;
    else if (countryA.name < countryB.name) return -1;
    else return 0;
  };

  handleOnSortByCountryName = (event) => {
    this.handleOnSortBy(event, this.sortByCountryName);
  };

  handleOnSortBy = (event, sortOperation) => {
    event.preventDefault();
    const countries = [...this.state.countries];
    countries.sort(sortOperation);
    this.setState({ countries });
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleFilterTextChange = (event) => {
    const filterText = event.target.value;
    this.setState({ filterText: filterText });
  };

  render() {
    const {
      countries,
      allCountryTotal,
      allCountryDeath,
      allCountryRecovered,
      allCountryActive,
      selectedCountries,
      filterText,
    } = this.state;
    return (
      <div>
        <h2 style={{ textAlign: "left" }}>
          All Country Confirmed: {this.numberWithCommas(allCountryTotal)}
        </h2>
        <h2 style={{ textAlign: "left" }}>
          All Country Death: {this.numberWithCommas(allCountryDeath)}
        </h2>
        <h2 style={{ textAlign: "left" }}>
          All Country Recovered: {this.numberWithCommas(allCountryRecovered)}
        </h2>
        <h2 style={{ textAlign: "left" }}>
          All Country Active: {this.numberWithCommas(allCountryActive)}
        </h2>
        {allCountryTotal === 0 ? (
          <Loading />
        ) : (
          <div>
            <div className="input-group input-group-lg mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-lg">
                  <Search />
                </span>
              </div>
              <input
                type="text"
                value={filterText}
                onChange={this.handleFilterTextChange}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Search"
              />
            </div>

            <Chart countries={selectedCountries} />
            <CountryTable
              countries={countries.filter((country) => {
                if (filterText === "") {
                  return country;
                }
                return (
                  country.name
                    .toLowerCase()
                    .indexOf(filterText.toLowerCase()) >= 0
                );
              })}
              onSortByTotal={this.handleOnSortByTotal}
              onSortByDeath={this.handleOnSortByDeath}
              onSortByRecovered={this.handleOnSortByRecovered}
              onSortByActive={this.handleOnSortByActive}
              onSortByCountryName={this.handleOnSortByCountryName}
              onRowSelected={this.handleOnRowSelected}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Covid;
