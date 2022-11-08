function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = window.React.useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

window.ReactDOM.render(window.React.createElement(Example), document.getElementById("app"));

