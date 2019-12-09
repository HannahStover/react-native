import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite } from "../redux/ActionCreators";
import { postComment } from "../redux/ActionCreators";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10, flex: 1 }}>{dish.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log("Already favorite") : props.onPress()
            }
          />
          <Icon
            raised
            reverse
            style={styles.cardItem}
            name="pencil"
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.onShowModal()}
          />
        </View>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating imageSize={12}>{item.rating} Stars</Rating>
        <Text style={{ fontSize: 12 }}>
          {"--" + item.author + ", " + item.date}
        </Text>
      </View>
    );
  };
  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

class DishDetail extends Component {
  static navigationOptions = {
    title: "Dish Details"
  };

  state = {
    showModal: false,
    rating: 5,
    author: "",
    comment: ""
  };

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: "",
      comment: "",
      showModal: false
    });
  }

  handleComment(dishId, rating, author, comment) {
    this.props.postComment(dishId, rating, author, comment);
    this.toggleModal();
  }

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal} style={{ flex: 1 }}>
            <Rating
              showRating
              type="star"
              startingValue={this.state.rating}
              style={{ paddingVertical: 10 }}
              defaultRating={5}
              onFinishRating={rating => this.setState({ rating: rating })}
            />
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              leftIconContainerStyle={{ paddingEnd: 8 }}
              onChangeText={author => this.setState({ author: author })}
            ></Input>
            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              leftIconContainerStyle={{ paddingEnd: 8 }}
              onChangeText={comment => this.setState({ comment: comment })}
            ></Input>
            <View style={{ margin: 10 }}>
              <Button
                style={styles.modalButton}
                onPress={() => {
                  this.resetForm();
                  this.handleComment();
                }}
                color="#512DA8"
                title="Submit"
              />
            </View>
            <View style={{ margin: 10 }}>
              <Button
                style={styles.modalButton}
                onPress={() => {
                  this.state.showModal;
                  this.resetForm();
                }}
                color="grey"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  cardItem: {
    flex: 1,
    margin: 10
  },
  modal: {
    justifyContent: "center",
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20
  },
  modalButton: {
    fontSize: 18,
    margin: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
