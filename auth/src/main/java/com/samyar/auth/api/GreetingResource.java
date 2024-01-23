package com.samyar.auth.api;

import java.net.URI;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.oidc.IdToken;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.NewCookie;


@Path("/")
public class GreetingResource {

    @Inject
    @IdToken                                        
    JsonWebToken idToken;    

    @Inject
    JsonWebToken accessToken;
    
    @GET
    @Path("/auth")
    @Authenticated
    public Response auth() {
        // Assume accessToken is a valid JWT token string
        String tokenValue = "Bearer " + accessToken.getRawToken();

        URI location = URI.create("http://localhost:5001/orders?new_token=true");

        // // Create a cookie with the token
        NewCookie authCookie = new NewCookie("Authorization", tokenValue, "/", null, null, NewCookie.DEFAULT_MAX_AGE, false, false);

        // // Redirect to the desired location and add the cookie to the response
        return Response.seeOther(location).cookie(authCookie).build();
        // URI location = URI.create("http://localhost:5001/");
        // return Response.seeOther(location).build();
        // return Response.ok( accessToken.getRawToken()).build();
        // Create a secure cookie with the token
        // NewCookie authCookie = new NewCookie("SSO-Token", accessToken.getRawToken(), "/", null, null, NewCookie.DEFAULT_MAX_AGE, true, true);

        // // Redirect to the desired location and add the cookie to the response
        // URI location = URI.create("http://localhost:5001/");
        // return Response.seeOther(location).cookie(authCookie).build();
    
    }
    


    @GET
    @RolesAllowed("admin")
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello, " + idToken.getClaim("name");
    }
    @GET
    @Path("/member-only")
    @RolesAllowed("member")
    @Produces(MediaType.TEXT_PLAIN)
    public String helloMember() {
        return "Hello, " + idToken.getClaim("name");
    }

    @GET
    @Path("post-logout")
    @Produces(MediaType.TEXT_PLAIN)
    public String postLogout() {
        return "You were logged out";
    }
}