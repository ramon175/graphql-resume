import Head from "next/head";
import { useQuery, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import { format } from "date-fns";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import prismStyle from "react-syntax-highlighter/dist/esm/styles/prism/xonokai";
import {print} from 'graphql/language/printer';

const ResumeQuery = gql`
  query ResumeQuery {
    bio {
      name
      tagline
      objective
      tagline
      github
      linkedin
      email
    }
    positions {
      id
      title
      company
      location
      startDate
      endDate
      years
      months
      achievements
    }
  }
`;

export default function Home() {
  const { data, error, loading } = useQuery(ResumeQuery);

  if (error) {
    return <span>Error... oops!</span>;
  }

  if (loading) {
    return (
      <header className={styles.header}>
        <h1>Ramon Castan</h1>
        <h2>Loading...</h2>
      </header>
    );
  }

  const { bio, positions } = data;

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1>{bio.name}</h1>
        <h2>{bio.tagline}</h2>
      </header>
      <div className={styles.split}>
        <div className={styles.left}>
          <h2>Contact</h2>
          <p>
            <strong>Email</strong>{" "}
            <a href={`mailto:${bio.email}`}>{bio.email}</a>
          </p>
          <p>
            <strong>Github</strong>{" "}
            <a href={bio.github}>{bio.github.replace("https://", "")}</a>
          </p>
          <p>
            <strong>LinkedIn</strong>{" "}
            <a href={bio.linkedin}>{bio.linkedin.replace("https://", "")}</a>
          </p>

          <SyntaxHighlighter languague="graphql" style={prismStyle}>
            {print(ResumeQuery)}
          </SyntaxHighlighter>
        </div>
        <div className={styles.right}>
          <h2>Objective</h2>
          <p>{bio.objective}</p>

          <h2>Experience</h2>
          {positions.map((position) => {
            const length = [
              position.years > 0 ? `${position.years} yrs` : null,
              position.months > 0 ? `${position.months} mths` : null,
            ]
              .filter((str) => str)
              .join(" ");

            return (
              <div key={position.id}>
                <h3>{position.title}</h3>
                <p className={styles.light}>
                  {position.company} | {position.location}
                </p>
                <p className={styles.light}>
                  {format(new Date(position.startDate), "MMM yyyy")} -{" "}
                  {position.endDate
                    ? format(new Date(position.endDate), "MMM yyyy")
                    : "Current"}
                  {` (${length})`}
                </p>
                <ul>
                  {position.achievements.map((achievement) => {
                    return <li key={achievement.id}>{achievement}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
