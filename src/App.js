import React, { useEffect, useState } from "react";
import List from "./List";
import Alert from "./Alert";



const getLocalStorage= ()=>{
let task = localStorage.getItem('task');
if(task)
{
  return JSON.parse(localStorage.getItem('task'))
}
else{
  return []
}

}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [alert, setAlert] = useState({
    show: true,
    msg: "",
    type: "",
  });

  const submitHandler = (event) => {
    event.preventDefault();

    if (!name) {
      //''---> empyt string == false
      //display alert
      showAlert(true, "danger", "Please Enter A Value");
    } 

    else if (name && isEditing) {
      //edit
      setList(
        list.map((item)=>
        {
          if(item.id === editItem)
          {  
            return {...item, title: name};

          }
          return item;
        })
      )
      setName("")
      setEditItem(null)
      setIsEditing(false)
      showAlert(true, "success", "Item edited successfully");
    } else {
      showAlert(true, "success", "Item successfully added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, "danger", "empty list");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", "Item deleted");
    setList(
      list.filter((item) => {
        if (item.id === id) {
          return false;
        } else {
          return true;
        }
      })
    );
  };

  const edit = (id) => {
    const toBeEditedList = list.find((item)=> item.id===id);
    setIsEditing(true);
    setEditItem(id);
    setName(toBeEditedList.title)

  };

  useEffect(()=>{
localStorage.setItem('task', JSON.stringify(list));
  }, [list])

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={submitHandler}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery's Here </h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eg. Milk 🥛"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? "edit" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} edit= {edit}/>
          <button className="clear-btn" onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
