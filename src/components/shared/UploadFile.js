import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

export class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: '',
      errors: '',
    };
  }

  componentDidMount() {
    document.getElementById(`input-file`).addEventListener('change', this.uploadPhoto);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      photo: nextProps.controls,
      errors: nextProps.errors,
    });
  }

  uploadPhoto = ({ target: { name }, target: { files } }) => {
    let file = files[0];

    if (file) {
      let tmppath = URL.createObjectURL(file);
      if (file.size && file.size / 1000 > 1024 * 10) {
        this.setState({
          photo: file.size / 1000 > 1024 ? '' : this.state.photo,
          errors: this.state.error ? this.state.error : ['photoSizeError'],
        });
      } else if (
        !file.type ||
        (file.type !== 'image/png' &&
          file.type !== 'image/jpg' &&
          file.type !== 'image/jpeg')
      ) {
        this.setState({
          photo: '',
          errors: this.state.error ? this.state.error : ['photoTypeError'],
        });
      } else {
        this.setState({
          photo: tmppath,
          errors: null,
        });

        if (window.navigator.userAgent.indexOf('Edge') > -1) {
          this.props.formData.append(name, file, file.name);
        } else {
          this.props.formData.set(name, file, file.name);
        }
      }

      this.props.action(this.state, this.props.name, this.props.formData);
    }
  };

  render() {
    return (
      <div id="form-group-add">
        <div className="form-group" id={`form-group-${this.props.name}`}></div>
        <label id={`cover-input-${this.props.name}`} htmlFor={`input-file`}>
          {this.props.locale}
        </label>
        <input
          id={`input-file-${this.props.name}`}
          name={this.props.name}
          className={`img-photo ${this.props.class}`}
          disabled={this.props.isDisabled}
          type="file"
        />
        {this.state.photo && (
          <div>
            <img className="img-photo" src={`${this.state.photo}`} />
          </div>
        )}
        <span>
          {this.props.submit &&
            !this.state.photo &&
            (this.state.errors.length > 0 || this.props.errors[0] !== null) && (
              <Message
                errors={[this.props.messages.uploadFile[this.state.errors]]}
                name={this.props.name}
              />
            )}
        </span>
      </div>
    );
  }
}
