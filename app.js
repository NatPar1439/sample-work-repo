import React, { Component } from 'react';
import './App.css';

function YearNumberList(props) {  // Year Number functional component, list form of dataset.
  const dataset = props.dataset;
  let listItems = [];
  
  for(const k in dataset) {
    listItems.push(<li>{[k, "  ", dataset[k]]}</li>);
  }
  
  return (
    <ul>{listItems}</ul>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      syear: null,
      eyear: null,
      stat: null,
      data: null,
      dataset: null,
      avg_dataset: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    this.getDataset();
    this.getAverageDataset();
  }
  
  handleSubmit(e) { // Handle all submission information, year, temperature, statistic
    e.preventDefault();
    this.setState({syear: e.target[0].value, 
                   eyear: e.target[1].value, 
                   stat: e.target[2].value},
                   () => {this.getStatistic();});
  }
  
  getStatistic() {  // Deals with fetch statements, recieve when ready
    switch(this.state.stat) {
      case "Maximum":
        this.getMaximum();
        break;
      case "Minimum":
        this.getMinimum();
        break;
      case "Average":
        this.getAverage();
        break;
      default:
        console.log("Invalid");
    }
  }
  
  getDataset() {
    const fetchString = `/dataset`;
    fetch(fetchString)
      .then(res => res.json())
      .then(ds => this.setState({dataset: ds}));
  }
  
  getAverageDataset() {
    const fetchString = `/dataset/average`;
    fetch(fetchString)
      .then(res => res.json())
      .then(ads => this.setState({avg_dataset: ads}));
  }
  
  getMaximum() {
    const fetchString = `/minran/${this.state.syear}/maxran/${this.state.eyear}/maximum`;
    fetch(fetchString)
      .then(res => res.json())
      .then(maximum => {
        this.setState({data: maximum},  // Ensure that <p> can read the text data
          () => {
            const text = JSON.stringify(this.state.data);
            document.getElementById("datainfo").innerHTML = text;
          });
      });
  }
  
  getMinimum() {
    const fetchString = `/minran/${this.state.syear}/maxran/${this.state.eyear}/minimum`;
    fetch(fetchString)
      .then(res => res.json())
      .then(minimum => {
        this.setState({data: minimum},
          () => {
            const text = JSON.stringify(this.state.data);
            document.getElementById("datainfo").innerHTML = text;
          });
      });
  }
  
  getAverage() {
    const fetchString = `/minran/${this.state.syear}/maxran/${this.state.eyear}/average`;
    fetch(fetchString)
      .then(res => res.json())
      .then(average => {
        this.setState({data: average},
          () => {
            const text = JSON.stringify(this.state.data);
            document.getElementById("datainfo").innerHTML = text;
          });
      });
  }

  render() {  // Basic HTML information, combined with components
    const { syear, eyear, stat, data, dataset } = this.state;
      return (
        <div className="App">
          <header>
            <h1>NOAA Climate at a glance Statistics 1880-2020 (Land and Ocean)</h1> 
            <p>The following information requires input into the appropriate boxes.</p>
          </header>
          <section>
            <form onSubmit={this.handleSubmit}>
              Start Year: 
              <input type="text" name="syear" placeholder="e.g. 1880"></input> <br></br>
              End Year: 
              <input type="text" name="eyear" placeholder="e.g. 2020"></input> <br></br>
              <select name="statistic">
                <option value="Maximum">Maximum</option>
                <option value="Minimum">Minimum</option>
                <option value="Average">Average</option>
              </select>
              <br></br>
              <button type="submit" value="Submit">Search</button>
            </form>
            <p id="datainfo" value={this.state.data}></p>
          </section>
          <aside>
            <h3>[Year] [Temperature]</h3>
            <YearNumberList dataset={this.state.dataset}/>
          </aside>
          <footer>
            <p><strong>Copyright © 2021 Nathaniel Park.</strong></p>
          </footer>
        </div>
      );
    }
}

export default App;
