import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Button,
  Alert
} from "react-native";
import DatePicker from "react-native-datepicker";
import * as Animatable from "react-native-animatable";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import * as Calendar from "expo-calendar";

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: ""
    };
  }

  static navigationOptions = {
    title: "Reserve Table"
  };

  obtainCalendarPermission = async () => {
    let calPermission = await Permissions.getAsync(Permissions.CALENDAR);
    if (calPermission.status !== "granted") {
      calPermission = await Permissions.askAsync(Permissions.CALENDAR);
      if (calPermission.status !== "granted") {
        Alert.alert("Permission not granted to show calendar");
      }
    }

    console.log(calPermission);
    return calPermission;
  };

  addReservationToCalendar = async date => {
    await this.obtainCalendarPermission();

    const reserveDate = new Date(Date.parse(date));
    const reserveEndDate = new Date(Date.parse(date) + 1000 * 60 * 60 * 2);

    const listCalendars = await Calendar.getCalendarsAsync();
    console.log("list of calendars: ", listCalendars);

    await Calendar.createEventAsync("1", {
      title: "Con Fusion Table Restaurant",
      startDate: reserveDate,
      endDate: reserveEndDate,
      timeZone: "Asia/Hong_Kong",
      location: "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong"
    });
  };

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(
      Permissions.USER_FACING_NOTIFICATIONS
    );
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      if (permission.status !== "granted") {
        Alert.alert("Permission not granted to show notifications");
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: "Your Reservation",
      body: "Reservation for " + date + " requested",
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: "#512DA8"
      }
    });
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: ""
    });
  }

  handleReservation = () => {
    Alert.alert(
      "Your Reservation OK?",
      `Number of Guests: ${this.state.guests}\nSmoking? ${this.state.smoking}\nDate and Time: ${this.state.date}`,

      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Reservation Cancelled");
            this.resetForm();
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            this.presentLocalNotification(this.state.date);
            this.addReservationToCalendar(this.state.date);
            this.resetForm();
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <ScrollView>
        <Animatable.View animation="zoomIn" delay={500}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker
              style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={itemValue => this.setState({ guests: itemValue })}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking</Text>
            <Switch
              style={styles.formItem}
              value={this.state.smoking}
              rackColor={{ true: "#512DA8", false: null }}
              onValueChange={value => this.setState({ smoking: value })}
            ></Switch>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <DatePicker
              style={{ flex: 2, marginRight: 20 }}
              date={this.state.date}
              format=""
              mode="datetime"
              placeholder="select date and time"
              minDate="2019-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={date => {
                this.setState({ date: date });
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Reserve"
              onPress={() => this.handleReservation()}
              color="#512DA8"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
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
  formItem: {
    flex: 1
  },
  button: {
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
  buttonText: {
    fontSize: 18,
    margin: 10
  }
});

export default Reservation;
