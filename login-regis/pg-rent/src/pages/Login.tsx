import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";

import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/loginValidation";
import { z } from "zod";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/home");
    }
  }, []);
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });
  // Register schema for only the required fields
  const registerSchema = z.object({
    city: z.string().min(1, { message: "City is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    fullName: z.string().min(2, { message: "Full Name is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
    mobile: z.string().min(10, { message: "Mobile is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    username: z.string().min(2, { message: "Username is required" }),
  });
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      city: "",
      email: "",
      fullName: "",
      gender: "",
      mobile: "",
      password: "",
      username: "",
    },
  });

  const onLogin = async (values: any) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      if (data.token) {
        Cookies.set("token", data.token, { expires: 7 });
        navigate("/home");
        // Optionally redirect or update UI here
      } else {
        alert("No token received");
      }
    } catch (err: any) {
      alert(err.message || "Login error");
    }
  };

  const onRegister = async (values: any) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      alert("Registration successful!");
      // Optionally redirect or update UI here
    } catch (err: any) {
      alert(err.message || "Registration error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome to PG Stay & Food Service
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm mt-2">
            Find your perfect accommodation and meal plan
          </p>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full px-6 pb-6">
          <TabsList className="w-full flex justify-center mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="flex flex-col gap-4"
              >
                <FormField
                  name="username"
                  control={loginForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={loginForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-2">
                  Login
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Row 1: Full Name & Username */}
                <div>
                  <FormField
                    name="fullName"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Full Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name="username"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Row 2: Email & Mobile */}
                <div>
                  <FormField
                    name="email"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name="mobile"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Mobile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Row 3: City & Gender */}
                <div>
                  <FormField
                    name="city"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name="gender"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Gender" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Row 4: Password (full width) */}
                <div className="md:col-span-2">
                  <FormField
                    name="password"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full mt-2">
                    Register
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
      <div className="mt-8 text-center text-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} PG Rent | Accommodation & Food Service
      </div>
    </div>
  );
};

export default Login;
