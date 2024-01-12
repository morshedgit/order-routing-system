# Stage 1: Build the application with Maven and Docker (Docker-in-Docker)
FROM registry.access.redhat.com/ubi8/openjdk-21

WORKDIR /project

# Copy the Maven project files and download dependencies
COPY ./pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy the source code
COPY ./src ./src

RUN mvn clean package

RUN ls -l /project/target > /project/target_ls_output.txt && cat /project/target_ls_output.txt

ENV LANGUAGE='en_US:en'

# We make four distinct layers so if there are application changes the library layers can be re-used
COPY --chown=185 target/quarkus-app/lib/ /deployments/lib/
COPY --chown=185 target/quarkus-app/*.jar /deployments/
COPY --chown=185 target/quarkus-app/app/ /deployments/app/
COPY --chown=185 target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8084
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]