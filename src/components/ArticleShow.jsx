import React, {Component} from 'react';
import { connect } from 'react-redux';
import { articleRef, firebaseApp } from '../firebase';
import CommentBox from './CommentBox';
import CommentDisplay from './CommentDisplay';
import {sendKey} from '../actions';
import {Link} from 'react-router';
import ArticleEdit from './ArticleEdit';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MetaTags from 'react-meta-tags';

class ArticleShow extends Component {

  state = {
    article: {},
    currentU:firebaseApp.auth().currentUser
  }

  componentDidMount() {
    firebaseApp.database().ref(`articles/${this.props.params.serverKey}`)
    .once('value', (shivam) => {
      this.setState({article: shivam.val()});
    })
    const serverKey  = {
      key: this.props.params.serverKey,

    }
  }

  renderEditBox(){
    if (this.state.currentU!= null && this.props.user.email==this.state.article.email) {
      return (<ArticleEdit skey={this.props.params.serverKey} />);
    } else {
      return (<div>Either you are not Logged in or you are not allowed to Edit this Post</div>);
    }

  }

  renderCommentBox(){
    if (this.state.currentU!= null) {
      return (<CommentBox serverKey={this.props.params.serverKey} />);
    } else {
      return (<h4>Please Login to comment on this Post</h4>);
    }
  }

  renderLikeButton(){
    if(this.state.liked === false){
      return (
        <button
          type="button"
          className="btn btn-primary"
          onClick={()=> this.triggerLike()}
        >Like</button>
      )
    } else {
      return (
        <button
          type="button"
          className="btn btn-danger"
          onClick={()=> this.triggerUnLike()}
        >Unlike</button>
      )
    }
  }


  render(){


    const { title, email, body } = this.state.article;
    return(
      <div className="wrapper">
      <div style={{margin:'25px'}} className="container">
      <Link to="/app">
        Back
      </Link>
      <article>
        <h1>{title}</h1>
        <span><em>Author: {email}</em></span>
        <p>{body}</p>
      </article>
      <hr />
      <div>
        <h2><u>Edit</u></h2>
        {this.renderEditBox()}
      </div>
      <hr />
      <div>
        <CommentDisplay serverKey={this.props.params.serverKey} />
      </div>
      <hr />
      <div>
        {this.renderCommentBox()}
      </div>
      </div>
      </div>
    )
  }
}


function mapStateToProps(state){
  const { articles } = state;
  const { user } = state;
  return {
    articles,
    user
  }
}

export default connect (mapStateToProps, {sendKey})(ArticleShow);
