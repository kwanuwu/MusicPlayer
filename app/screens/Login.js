import CustomizeButton from "../components/CustomizeButton";
import Navigator from "../components/Navigator";
import { AppContext } from "../context/AppProvider";
import { authentication } from "../misc/services";
import { passwordPattern } from "../patterns/pattern";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlbumImage from "../components/AlbumImage";

function Login({ navigation }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const appContext = useContext(AppContext);
  const [wrongPassword, setWrongPassword] = useState(null);
  const [wrongUserName, setWrongUserName] = useState(null);

  const onSubmit = async (data) => {
    const res = await authentication({ action: "login", data });
    try {
      if (res.status === 401) {
        if (res.type === "username") {
          setWrongUserName(res.message);
        } else if (res.type === "password") {
          setWrongPassword(res.message);
        }
      } else {
        setWrongUserName(null);
        setWrongPassword(null);
        appContext.updateState(appContext, {
          loggedIn: true,
          username: data.username,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.KeyboardAwareScrollView}>
      <AlbumImage />
      <View>
        {/* USERNAME */}
        <Text style={styles.span}>Username</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => {
                onChange(value);
                if (wrongUserName) setWrongUserName(null);
              }}
              value={value}
            />
          )}
          name="username"
          rules={{
            required: "Username is required",
          }}
        />
        {errors.username && (
          <Text style={styles.error}>{errors.username.message}</Text>
        )}
        {wrongUserName && <Text style={styles.error}>{wrongUserName}</Text>}

        {/* PASSWORD */}
        <Text style={styles.span}>Password</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => {
                onChange(value);
                if (wrongPassword) setWrongPassword(null);
              }}
              value={value}
            />
          )}
          name="password"
          rules={{
            required: "Password is required!",
            pattern: {
              value: passwordPattern,
              message:
                "Password must contain at least eight characters, at least one letter and one number!",
            },
          }}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
        {wrongPassword && <Text style={styles.error}>{wrongPassword}</Text>}
        <Navigator
          navigation={navigation}
          text="Doesn't have an account yet? Go to"
          navigate="Register"
        />
        {/* SUBMIT */}
        <CustomizeButton pressed={handleSubmit(onSubmit)} title="Log in" />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  span: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    marginBottom: 10,
  },
  error: {
    fontSize: 12,
    color: "red",
  },
  input: {
    borderColor: "white",
    color: "white",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
  },
  KeyboardAwareScrollView: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 32,
    backgroundColor: "#3a3d46",
  },
});

export default Login;
