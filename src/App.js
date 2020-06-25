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
    selectedIndex: 0,
    isMouseActive: false,
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

  moveFocus = e => {
    this.setState({ isMouseActive: false });
    //select only on first key press
    if (
      e.keyCode === 40 &&
      this.state.selectedIndex !== this.state.filteredData?.length - 1
    ) {
      //remove focus from previously selected Items
      // const active = document.activeElement;
      // active.blur();

      if (this.state.selectedIndex === null) {
        this.setState({ selectedIndex: 0 });
      } else {
        this.setState(
          { selectedIndex: ++this.state.selectedIndex },
          function () {
            //console.log(this.state.selectedIndex);
            var focusable = document.querySelectorAll(
              '[tabindex]:not([tabindex="-1"])',
            );
            //console.log(focusable[0]);
            focusable[this.state.selectedIndex].scrollIntoView({
              block: 'center',
            });
          },
        );
      }
    } else if (e.keyCode === 38 && this.state.selectedIndex > 0) {
      this.setState({ selectedIndex: --this.state.selectedIndex }, function () {
        // console.log(this.state.selectedIndex);
        var focusable = document.querySelectorAll(
          '[tabindex]:not([tabindex="-1"])',
        );
        // console.log(focusable[0]);
        focusable[this.state.selectedIndex].scrollIntoView({
          block: 'center',
        });
      });
    }
  };

  setMouseActive = () => {
    this.setState({ isMouseActive: true });
  };

  setMouseInactive = () => {
    this.setState({ isMouseActive: false });
  };

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
  });

  // Put loadash debounce here
  _handleChange = e => {
    const {
      target: { value },
    } = e;
    this._debounceSearch(value);
  };

  render() {
    const {
      loader,
      filteredData,
      error,
      errorMessage,
      selectedIndex,
      isMouseActive,
    } = this.state;
    return (
      <div
        onKeyDown={this.moveFocus}
        onMouseEnter={this.setMouseActive}
        onMouseLeave={this.setMouseInactive}
        onMouseMove={this.setMouseActive}
      >
        {error && <span>{errorMessage}</span>}
        {loader && (
          <span>
            Loading
            <Loader type="Circles" color="#00BFFF" height={600} width={600} />
          </span>
        )}
        {!loader && (
          <>
            <div className="form-group has-search">
              <span className="fa fa-search form-control-feedback"></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search users by Id, address, Name, Items, Pincode"
                onChange={this._handleChange}
              ></input>
            </div>
          </>
        )}
        {filteredData?.length > 0 && (
          <>
            <Paper
              className={isMouseActive ? 'searchRow' : ''}
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
                <>
                  <SearchRow
                    rowData={rowData}
                    key={index}
                    id={index}
                    selected={selectedIndex}
                    tabindex={index}
                    isMouseActive={isMouseActive}
                  ></SearchRow>
                </>
              ))}
            </Paper>
          </>
        )}
        {filteredData?.length === 0 && (
          <Paper className="noData">
            <div>No User Found</div>
          </Paper>
        )}
      </div>
    );
  }
}

export default App;
