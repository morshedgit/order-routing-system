# Single-stage build: Build and run the application in the same image
FROM registry.access.redhat.com/ubi8/openjdk-21

WORKDIR /project

# Copy the Maven project files and download dependencies
COPY ./pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy the source code
COPY ./src ./src

# Build the application
RUN mvn clean package \
    # Then move the artifacts from target/quarkus-app to /deployments
    && mv target/quarkus-app/lib/ /deployments/lib/ \
    && mv target/quarkus-app/*.jar /deployments/ \
    && mv target/quarkus-app/app/ /deployments/app/ \
    && mv target/quarkus-app/quarkus/ /deployments/quarkus/

ENV LANGUAGE='en_US:en'

EXPOSE 8083
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]
