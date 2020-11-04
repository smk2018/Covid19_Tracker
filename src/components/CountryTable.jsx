import React, { Component } from "react";

class CountryTable extends Component {
  render() {
    const {
      countries,
      onSortByTotal,
      onSortByDeath,
      onSortByRecovered,
      onSortByActive,
      onSortByCountryName,
      onRowSelected,
    } = this.props;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <a href="/" onClick={onSortByCountryName}>
                Country
              </a>
            </th>
            <th>
              <a href="/" onClick={onSortByTotal}>
                Confirmed
              </a>
            </th>
            <th>
              <a href="/" onClick={onSortByDeath}>
                Death
              </a>
            </th>
            <th>
              <a href="/" onClick={onSortByRecovered}>
                Recovered
              </a>
            </th>
            <th>
              <a href="/" onClick={onSortByActive}>
                Active
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => {
            const style = {
              backgroundColor: "lightYellow",
            };
            return (
              <tr
                key={country.name}
                style={country.selected ? style : null}
                onClick={() => onRowSelected(country)}
              >
                <td>{country.name}</td>
                <td>{country.total}</td>
                <td>{country.death}</td>
                <td>{country.recover}</td>
                <td>{country.active}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default CountryTable;
