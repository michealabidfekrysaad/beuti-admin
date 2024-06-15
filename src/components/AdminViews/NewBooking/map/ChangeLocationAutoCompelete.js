import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

class ChangeLocationAutoCompelete extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ['geocode'], componentRestrictions: { country: 'sa' } },
    );

    this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
  }

  handlePlaceChanged() {
    try {
      const place = this.autocomplete.getPlace();
      if (typeof place === 'object') {
        // eslint-disable-next-line react/prop-types
        this.props.setGetSearchPlace(place);
        // eslint-disable-next-line react/prop-types
        console.log(place);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  render() {
    return (
      <input
        ref={this.autocompleteInput}
        id="autocomplete"
        type="text"
        // eslint-disable-next-line react/prop-types
        placeholder={this.props.salonLocation.addressEN}
        // eslint-disable-next-line react/prop-types
        className={`${this.props.className} ui input`}
        style={{ display: 'absolute', top: '410px' }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC_5d_KRlQI-ImerPd1hZFrtQYKWL-yS10',
  language: 'ar',
})(ChangeLocationAutoCompelete);
