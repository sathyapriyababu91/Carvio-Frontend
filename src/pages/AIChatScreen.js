import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";

import {
  useSpeechRecognitionEvent,
  ExpoSpeechRecognitionModule,
} from "expo-speech-recognition";

export default function AIChatScreen({ setActiveTab }) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi! 👋 I'm CARVIO AI. I can help you find cars, bikes and commercial vehicles available on CARVIO.",
      sender: "ai",
      cars: [],
    },
  ]);

  useSpeechRecognitionEvent("start", () => {
    setIsRecording(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcript =
      event.results?.[0]?.transcript || "";

    if (transcript) {
      setMessage(transcript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log("SPEECH ERROR:", event);
    setIsRecording(false);
  });

  const startRecording = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (!result.granted) {
        alert("Microphone permission is required.");
        return;
      }

      await ExpoSpeechRecognitionModule.start({
        lang: "en-IN",
        interimResults: true,
        continuous: false,
      });

      console.log("Speech recognition started");
    } catch (error) {
      console.log("START SPEECH ERROR:", error);
    }
  };

  const stopRecording = async () => {
    try {
      ExpoSpeechRecognitionModule.stop();

      setIsRecording(false);

      console.log("Speech recognition stopped");
    } catch (error) {
      console.log("STOP SPEECH ERROR:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: userMessage,
        sender: "user",
        cars: [],
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://carvio-backend.onrender.com/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: data.reply,
            sender: "ai",
            cars: data.cars || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Sorry, I couldn't process your request.",
            sender: "ai",
            cars: [],
          },
        ]);
      }
    } catch (error) {
      console.log("AI CHAT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Unable to connect to CARVIO AI. Please make sure the backend is running.",
          sender: "ai",
          cars: [],
        },
      ]);
    }

    setLoading(false);
  };

  const renderCarCard = (car) => {
    const imageUrl =
      Array.isArray(car.images) && car.images.length > 0
        ? car.images[0]
        : null;

    return (
      <View
        key={car.id}
        style={{
          marginTop: 12,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#E2E7F0",
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: "100%",
              height: 190,
              backgroundColor: "#EEF1F6",
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: 150,
              backgroundColor: "#EEF1F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 40,
              }}
            >
              🚗
            </Text>

            <Text
              style={{
                color: "#777",
                marginTop: 5,
                fontSize: 13,
              }}
            >
              No photo available
            </Text>
          </View>
        )}

        <View
          style={{
            padding: 14,
          }}
        >
          <Text
            style={{
              color: "#12224F",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            {car.brand} {car.modelName}
          </Text>

          <Text
            style={{
              color: "#2F6FED",
              fontSize: 19,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            ₹{Number(car.price || 0).toLocaleString("en-IN")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                color: "#555",
                fontSize: 13,
                marginRight: 12,
                marginBottom: 7,
              }}
            >
              📅 {car.year}
            </Text>

            <Text
              style={{
                color: "#555",
                fontSize: 13,
                marginRight: 12,
                marginBottom: 7,
              }}
            >
              ⛽ {car.fuelType}
            </Text>

            <Text
              style={{
                color: "#555",
                fontSize: 13,
                marginRight: 12,
                marginBottom: 7,
              }}
            >
              ⚙️ {car.transmission}
            </Text>

            <Text
              style={{
                color: "#555",
                fontSize: 13,
                marginRight: 12,
                marginBottom: 7,
              }}
            >
              👤 {car.ownerType}
            </Text>

            <Text
              style={{
                color: "#555",
                fontSize: 13,
                marginRight: 12,
                marginBottom: 7,
              }}
            >
              🛣️ {car.kmsDriven} km
            </Text>
          </View>

          <View
            style={{
              marginTop: 5,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: "#EEF1F5",
            }}
          >
            <Text
              style={{
                color: "#555",
                fontSize: 13,
              }}
            >
              📍 {car.location || "Location not available"}
            </Text>
          </View>

          {car.condition ? (
            <Text
              style={{
                color: "#777",
                fontSize: 13,
                marginTop: 7,
              }}
            >
              Condition: {car.condition}
            </Text>
          ) : null}

          {car.description ? (
            <Text
              style={{
                color: "#666",
                fontSize: 13,
                marginTop: 7,
              }}
            >
              {car.description}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={{
          alignItems: isUser
            ? "flex-end"
            : "flex-start",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            maxWidth: "88%",
            backgroundColor: isUser
              ? "#2F6FED"
              : "#FFFFFF",
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 18,
            borderBottomRightRadius: isUser
              ? 5
              : 18,
            borderBottomLeftRadius: isUser
              ? 18
              : 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {!isUser && (
            <Text
              style={{
                color: "#2F6FED",
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              ✨ CARVIO AI
            </Text>
          )}

          <Text
            style={{
              color: isUser
                ? "#FFFFFF"
                : "#101B36",
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            {item.text}
          </Text>

          {!isUser &&
            item.cars &&
            item.cars.length > 0 && (
              <View>
                {item.cars.map((car) =>
                  renderCarCard(car)
                )}
              </View>
            )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#F7F9FC",
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View
        style={{
          backgroundColor: "#12224F",
          paddingHorizontal: 18,
          paddingVertical: 15,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("HOME")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor:
              "rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 23,
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#2F6FED",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
          }}
        >
          <Text style={{ fontSize: 22 }}>
            ✨
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 19,
              fontWeight: "bold",
            }}
          >
            CARVIO AI
          </Text>

          <Text
            style={{
              color: "#BFD0FF",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            Vehicle Assistant
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 20,
          paddingBottom: 15,
        }}
        showsVerticalScrollIndicator={false}
      />

      {loading && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 8,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: "#666",
                fontSize: 13,
              }}
            >
              ✨ CARVIO AI is thinking...
            </Text>
          </View>
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E6E9F0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={
              isRecording
                ? stopRecording
                : startRecording
            }
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: isRecording
                ? "#D32F2F"
                : "#EEF4FF",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 21 }}>
              {isRecording ? "⏹️" : "🎤"}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              minHeight: 46,
              backgroundColor: "#F1F3F7",
              borderRadius: 24,
              justifyContent: "center",
            }}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={
                isRecording
                  ? "Listening..."
                  : "Ask CARVIO AI..."
              }
              placeholderTextColor="#888"
              style={{
                paddingHorizontal: 17,
                paddingVertical: 10,
                fontSize: 15,
                color: "#101B36",
              }}
              onSubmitEditing={sendMessage}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={
              loading || !message.trim()
            }
            style={{
              marginLeft: 8,
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor:
                loading || !message.trim()
                  ? "#B9C8E8"
                  : "#2F6FED",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                marginLeft: 2,
              }}
            >
              ➤
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
