class App extends React.Component {
  state = {
    bookmarks: [],
    formData: {
      title: "",
      url: "",
    },
    updateData: {
      title: "",
      url: "",
    },
    editMode: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch("/bookmarks")
      .then((response) => response.json())
      .then((bookmarks) => this.setState({ bookmarks: bookmarks }));
  };

  handleChange = (event) => {
    const newData = { ...this.state.formData };
    newData[event.target.id] = event.target.value;

    this.setState({
      formData: newData,
    });
  };

  handleUpdate = (event) => {
    const updateBookmark = { ...this.state.updateData };
    updateBookmark[event.target.id] = event.target.value;
    this.setState({
      updateData: updateBookmark,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.formData);
    fetch("/bookmarks", {
      body: JSON.stringify({
        title: this.state.formData.title,
        url: this.state.formData.url,
      }),
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((createdBookmark) => {
        return createdBookmark.json();
      })
      .then((jsonedBookmark) => {
        this.setState({
          formData: {
            title: "",
            url: "",
          },
          bookmarks: [jsonedBookmark, ...this.state.bookmarks],
        });
      })
      .catch((error) => console.log(error));
  };

  deleteBookmark = (id, index) => {
    fetch("bookmarks/" + id, {
      method: "DELETE",
    }).then((data) => {
      this.setState({
        bookmarks: [
          ...this.state.bookmarks.slice(0, index),
          ...this.state.bookmarks.slice(index + 1),
        ],
      });
    });
  };

  editBookmark = (bookmark, index) => {
    this.setState({
      editMode: !this.state.editMode,
    });
  };

  submitUpdateBookmark = (event, bookmark) => {
    event.preventDefault();

    bookmark.title = this.state.updateData.title;
    fetch("bookmarks/" + bookmark._id, {
      body: JSON.stringify(bookmark),
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((updatedBookmark) => updatedBookmark.json())
      .then((jsonedBookmark) => {
        fetch("/bookmarks")
          .then((response) => response.json())
          .then((bookmarks) => {
            this.setState({
              bookmarks: bookmarks,
              editMode: !this.state.editMode,
              updateData: { title: "", url: "" },
            });
          });
      });
  };

  render() {
    return (
      <div className="bookmark-container">
        <div className="main-title">
          <h1>Bookmarks</h1>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.formData.title}
              onChange={this.handleChange}
              id="title"
              placeHolder="Portfolio Bruno-DaSilva"
            />
            <input
              type="text"
              value={this.state.formData.url}
              onChange={this.handleChange}
              id="url"
              placeHolder="www.bruno-dasilva.com"
            />
            <input type="submit" />
          </form>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <th>Site Title</th>
              <th>Visit Site</th>
              <th className="danger">Remove</th>
              <th className="danger">Edit</th>
            </thead>
            <tbody>
              {this.state.bookmarks.map((bookmark, index) => {
                return (
                  <tr class="bookmark-wrapper">
                    <td>
                      {this.state.editMode ? (
                        <form
                          id="edit-form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            this.submitUpdateBookmark(e, bookmark);
                          }}
                        >
                          <input
                            type="text"
                            default={bookmark.title}
                            value={this.state.updateData.title}
                            onChange={this.handleUpdate}
                            placeHolder={bookmark.title}
                            id="title"
                          />
                          <input
                            type="text"
                            default={bookmark.url}
                            value={this.state.updateData.url}
                            onChange={this.handleUpdate}
                            id="url"
                            placeHolder={bookmark.url}
                          />
                          <input type="submit" />
                        </form>
                      ) : (
                        <p>{bookmark.title}</p>
                      )}
                    </td>
                    <td>
                      {this.state.editMode ? (
                        ""
                      ) : (
                        <a
                          href={bookmark.url}
                          target="_blank"
                          title={` Redirect me to ${bookmark.title}`}
                        >
                          {bookmark.url}
                        </a>
                      )}
                    </td>

                    <td
                      onClick={() => this.deleteBookmark(bookmark._id, index)}
                    >
                      <i class="fas fa-trash-alt"></i>
                    </td>

                    <td type="button" onClick={() => this.editBookmark()}>
                      <i id="edit" class="fas fa-pencil-alt"></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".container"));
