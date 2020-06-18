import React, { Component } from 'react';
import { Paper } from '@material-ui/core';
import SearchRow from './SearchRow';
import Loader from 'react-loader-spinner';
import debounce from 'lodash.debounce';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.moveFocus = this.moveFocus.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }
  state = {
    loader: true,
    data: null,
    filteredData: null,
    error: false,
    errorMessage: null,
    ismovefocusdefined: false,
  };

  async componentDidMount() {
    this.setState({
      loader: true,
    });
    try {
      const response = await fetch(
        'https://www.mocky.io/v2/5ba8efb23100007200c2750c',
      );
      const data = await response.json();
      this.setState({
        loader: false,
        data: data,
        filteredData: null,
      });
    } catch (error) {
      this.setState({
        loader: false,
        error: true,
        errorMessage: error.message,
      });
    }
  }

  moveFocus() {
    const node = this.myRef.current;
    //Set this event listner only once
    if (node && this.state.ismovefocusdefined === false) {
      node.addEventListener('keydown', function (e) {
        const active = document.activeElement;
        if (e.keyCode === 40 && active.nextSibling) {
          active.nextSibling.focus();
        }
        if (e.keyCode === 38 && active.previousSibling) {
          active.previousSibling.focus();
        }
      });
      this.setState({ ismovefocusdefined: true });
    }
  }

  debounceSearch = debounce(e => {
    const {
      target: { value },
    } = e;
    this._handleChange(value);
  }, 300);

  _debounceSearch = debounce(value => {
    const { data } = this.state;
    if (!value) {
      this.setState({
        filteredData: this.state.data,
      });
    } else {
      const searchedUsers = data.filter(user => {
        if (!user.name.toLowerCase().indexOf(value?.toLowerCase())) {
          return user;
        } else if (!user.id.indexOf(value)) {
          return user;
        } else if (!user.address.toLowerCase().indexOf(value.toLowerCase())) {
          return user;
        } else if (!user.pincode.indexOf(value)) {
          return user;
        } else if (user.items) {
          for (let i = 0; i < user?.items?.length; i++) {
            if (user?.items[i].toLowerCase().includes(value.toLowerCase())) {
              return user;
            }
          }
        }
      });
      this.setState({
        filteredData: searchedUsers,
      });
    }
    //could have used a mutation observer as well
    setTimeout(
      function () {
        this.moveFocus();
      }.bind(this),
      300,
    );
  }, 300);

  // Put loadash debounce here
  _handleChange = e => {
    const {
      target: { value },
    } = e;
    this._debounceSearch(value);
  };

  render() {
    const { loader, filteredData, error, errorMessage } = this.state;
    return (
      <>
        {error && <span>{errorMessage}</span>}
        {loader && (
          <span>
            Loading
            <Loader type="Circles" color="#00BFFF" height={600} width={600} />
          </span>
        )}
        {!loader && (
          <>
            <div class="form-group has-search">
              <span class="fa fa-search form-control-feedback"></span>
              <input
                type="text"
                class="form-control"
                placeholder="Search users by Id, address, Name, Items, Pincode"
                onChange={this._handleChange}
              ></input>
            </div>
          </>
        )}
        {filteredData?.length > 0 && (
          <>
            <Paper
              className="searchRow"
              ref={this.myRef}
              style={{
                backgroundColor: 'white',
                width: '50%',
                position: 'absolute',
                height: '100%',
                zIndex: 1,
                overflow: 'scroll',
                margin: '10px',
              }}
            >
              {filteredData.map((rowData, index) => (
                <SearchRow
                  rowData={rowData}
                  key={rowData.id}
                  tabindex={index}
                ></SearchRow>
              ))}
            </Paper>
          </>
        )}
        {filteredData?.length === 0 && (
          <Paper className="noData">
            <div>No User Found</div>
          </Paper>
        )}
      </>
    );
  }
}

export default App;
