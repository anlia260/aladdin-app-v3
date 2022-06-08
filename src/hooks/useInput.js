import { useState, useCallback } from "react";

function useInput(initValue, opsiton = {}, changeCallBack = () => { }) {
  const [value, setValue] = useState(initValue)
  const onChange = useCallback(value => {
    let _value = value;
    if (value.target) {
      _value = value.target.value;
    }
    setValue(_value);
    changeCallBack(_value);
  }, [changeCallBack])
  return {
    value,
    setValue,
    onChange,
    ...opsiton
  }
}

export default useInput;

export function useInputs(obj) {
  const [value, setValue] = useState(obj);
  return {
    value,
    set: (key) => ({
      value: value[key],
      onChange: (value) =>
        setValue((v) => ({
          ...v,
          [key]: value,
        })),
      name: key,
    }),
  };
}
