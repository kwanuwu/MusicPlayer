import CustomizeButton from "../components/CustomizeButton";
import Navigator from "../components/Navigator";
import { authentication } from "../misc/services";
import { emailPattern, passwordPattern } from "../patterns/pattern";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlbumImage from "../components/AlbumImage";

function Register({ navigation }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [usernameExisted, setUsernameExisted] = useState(null);
  const [emailExisted, setEmailExisted] = useState(null);
  const onSubmit = async (data) => {
    const res = await authentication({ action: "register", data });
    try {
      if (res.status === 401) {
        if (res.type === "username") {
          setUsernameExisted(res.message);
        } else if (res.type === "email") {
          setEmailExisted(res.message);
        }
      } else {
        setUsernameExisted(null);
        setEmailExisted(null);
        navigation.navigate({ name: "Login" });
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
                if (usernameExisted) setUsernameExisted(null);
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
        {usernameExisted && <Text style={styles.error}>{usernameExisted}</Text>}
        {/* EMAIL */}
        <Text style={styles.span}>Email</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => {
                onChange(value);
                if (emailExisted) setEmailExisted(null);
              }}
              value={value}
            />
          )}
          name="email"
          rules={{
            required: "Email is required",
            pattern: { value: emailPattern, message: "Wrong email validation" },
          }}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        {emailExisted && <Text style={styles.error}>{emailExisted}</Text>}
        {/* PASSWORD */}
        <Text style={styles.span}>Password</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="password"
          rules={{
            required: "Password is required",
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
        {/* CONFIRM PASSWORD */}
        <Text style={styles.span}>Confirm Password</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="confirmPassword"
          rules={{
            required: "Confirm Password is required",
            pattern: {
              value: passwordPattern,
              message:
                "Password must contain at least eight characters, at least one letter and one number!",
            },
            validate: (value) =>
              value === watch("password") || "Passwords must match",
          }}
        />
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}
        <Navigator
          navigation={navigation}
          text="Already has an account? Go to"
          navigate="Login"
        />
        {/* SUBMIT */}
        <CustomizeButton pressed={handleSubmit(onSubmit)} title="Register" />
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

export default Register;
