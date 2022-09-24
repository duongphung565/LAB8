
import React, { Component } from 'react';
import Home from './HomeComponent.js'
import Menu from './MenuComponent.js'
import Contact from './ContactComponent.js';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent.js'
import Footer from './FooterComponent.js';
import About from './AboutComponent.js';


import { postComment, postFeedback, fetchDishes, fetchComments, fetchPromos, fetchLeaders, loginUser, logoutUser, postFavorite, deleteFavorite } from '../redux/ActionCreators';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders,

    }
}
const mapDispatchToProps = (dispatch) => ({
    postComment: (dishId, rating, comment) => dispatch(postComment(dishId, rating, comment)),
    resetFeedbackForm: () => { dispatch(actions.reset('feedback')) },
    fetchComments: () => { dispatch(fetchComments()) },
    fetchPromos: () => { dispatch(fetchPromos()) },
    fetchDishes: () => { dispatch(fetchDishes()) },
    fetchLeaders: () => dispatch(fetchLeaders()),
    postFeedback: (feedback) => dispatch(postFeedback(feedback)),
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser()),

    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
});
class Main extends Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();

    }


    render() {
        const HomePage = () => {
            return (

                <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishesErrMess={this.props.dishes.errMess}

                />
            );
        }
        const DishWithId = ({ match }) => {
            return (
                <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id == match.params.dishId)[0]}

                    isLoading={this.props.dishes.isLoading}
                    errMess={this.props.dishes.errMess}
                    comments={this.props.comments.comments.filter((comment) => {
                        console.log(comment.dish);
                        // console.log(comment.dish.id == match.params.dishId);
                    }
                    )}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}

                    postFavorite={this.props.postFavorite}
                />
            );
        };
        return (
            <div>
                <Header />
                <Switch>
                    <Route path="/home" component={HomePage} />
                    <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders} />} />
                    <Route
                        exact path="/menu"
                        component={
                            () => <Menu dishes={this.props.dishes} />
                        } />
                    <Route path="/menu/:dishId" component={DishWithId} />

                    <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
                    <Redirect to="/home" />

                </Switch >
                <Footer />
            </div >
        );
        //component={DishWithId}

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
