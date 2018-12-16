import React, { Component } from "react";

// Suggestion components
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

// Core material-ui components
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

// Our suggestions
import suggestions from "./suggestions";

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
    minWidth: "300px",
    maxWidth: "500px"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: []
    };
  }

  renderInput = inputProps => {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        autoFocus={true}
        fullWidth
        InputProps={{
          inputRef: ref,
          classes: {
            input: classes.input
          },
          ...other
        }}
      />
    );
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
      <MenuItem
        selected={isHighlighted}
        component="div"
        onClick={() => {
          console.log(suggestion.label);
        }}
      >
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  };

  renderSuggestionsContainer = options => {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  };

  getSuggestionValue = suggestion => {
    return suggestion.label;
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let results = [];
    let count = 0;
    if (inputLength === 0) {
      results = [];
    } else {
      for (var i = 0; i < suggestions.length; i++) {
        let matchingIndex = suggestions[i].label.toLowerCase().indexOf(inputValue);
        if (count > 9) {
          // matching 10 results.
          break;
        } else if (matchingIndex > -1) {
          results.push(suggestions[i]);
          count = count + 1;
        } else {
          // Do nothing
        }
      }
    }

    return results;
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Autosuggest
          theme={{
            container:
              this.state.width >= 769
                ? {
                    flexGrow: 1,
                    position: "relative",
                    minWidth: "340px"
                  }
                : {
                    flexGrow: 1,
                    position: "relative",
                    minWidth: "240px"
                  },
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderInputComponent={this.renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={{
            classes,
            placeholder: "What are you looking for?",
            value: this.state.value,
            onChange: this.handleChange,
            color: "inherit"
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(App);
