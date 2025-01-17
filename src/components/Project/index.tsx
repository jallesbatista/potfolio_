import {
  Project as ProjectWrapper,
  ProjectTitle,
  ProjectStack,
  ProjectStackTech,
  ProjectLink,
  ProjectLinks,
} from "./style";

import { Text } from "@/styles/Text";
import { useEffect, useState } from "react";
import { FaGithub, FaShare } from "react-icons/fa";
import { IoMdRocket } from "react-icons/io";
import { userData } from "@/utils/userData";

interface ReposType {
  id: number;
  name: string;
  language: string;
  description: string;
  html_url: string;
  homepage: string;
  deployUrl: string | undefined;
}

export const Project = (): JSX.Element => {
  const [repositories, setRepositories] = useState<ReposType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `https://api.github.com/users/${userData.githubUser}/repos?sort=created&direction=desc`
      );

      const projects = [
        {
          name: "KenzieHub",
          url: "https://khubproject.vercel.app",
        },
        { name: "poke-app", url: "https://pokesearch-vue.netlify.app" },
        { name: "port-geek", url: "https://port-geek.vercel.app" },
        { name: "nukenzie", url: "https://nu-kenzieproject.vercel.app" },
        { name: "portfolio_", url: "https://portfolio-jallesbatista.netlify.app" },
        { name: "MotorsShop-Front", url: "https://motorshoptemplate.netlify.app" },
        { name: "hamburgueria", url: "https://kburguer.vercel.app" },
      ];
      const json = await data.json();

      const mappedLanguages = json.map(async (repo: any) => {
        const languageData = await fetch(repo.languages_url);

        const dataJson = await languageData.json();

        projects.forEach((el) => {
          if (repo.name == el.name) {
            repo.deployUrl = el.url;
          }
        });

        return {
          ...repo,
          language: Object.keys(dataJson)[0],
        };
      });
      Promise.all(mappedLanguages).then((values) => {
        setRepositories(values);
      });

      return json;
    };

    fetchData();
  }, []);
  return (
    <>
      {repositories &&
        repositories?.map?.((repository) => (
          <ProjectWrapper key={repository.id}>
            <ProjectTitle as={"h2"} type="heading3" css={{ marginBottom: "$3" }} color="grey4">
              {repository.name}
            </ProjectTitle>

            <ProjectStack>
              <Text type="body2" color="grey2">
                Primary Language:
              </Text>
              {repository.language ? (
                <ProjectStackTech>
                  <Text color="grey2" type="body2">
                    {repository.language}
                  </Text>
                </ProjectStackTech>
              ) : (
                <ProjectStackTech>
                  <Text color="grey2" type="body2">
                    Primary language not identified
                  </Text>
                </ProjectStackTech>
              )}
            </ProjectStack>

            <Text type="body1" color="grey2">
              {repository.description?.substring(0, 129)}
            </Text>
            <ProjectLinks>
              <ProjectLink target="_blank" href={repository.html_url}>
                <FaGithub /> Github Code
              </ProjectLink>

              {repository.deployUrl && (
                <ProjectLink target="_blank" href={repository.deployUrl}>
                  <IoMdRocket /> Deploy Link
                </ProjectLink>
              )}
            </ProjectLinks>
          </ProjectWrapper>
        ))}
    </>
  );
};
