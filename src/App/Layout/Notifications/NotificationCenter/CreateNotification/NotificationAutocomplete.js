import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Asynchronous({ roles}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
        let active = true;

        if (!loading) {
          return undefined;
        }

        (async () => {
     
          await sleep(1e2); // For demo purposes.
          if (active) {
            setOptions(roles);
          }
        })();

        return () => {
          active = false;
        };
  }, [loading]);

    const handleOnChange = (event, value) => {
        console.log("any", event.target.name);
    }

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
          }}
        
      getOptionLabel={(option) => option.firstName +" " + option.lastName}
      options={options}
          loading={loading}
          onChange={handleOnChange}
          renderInput={(params) => (
        <TextField
          {...params}
              label="Assigned To"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}