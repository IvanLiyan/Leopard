import { NextPage } from "next";
import { Container, Box, Text, Heading } from "@ContextLogic/atlas-ui";
import NoticeIntakeForm from "src/app/notice-portal/components/NoticeIntakeForm";
import PageRoot from "@core/components/PageRoot";
import { useTitleHook } from "./../../hooks/index";

const NoticeIntakePage: NextPage<Record<string, never>> = () => {
  useTitleHook("Wish | Report Illegal Content");

  return (
    <PageRoot>
      <Container sx={{ mt: 5, pb: 5 }}>
        <Box sx={{ mb: 5 }}>
          <Heading gutterBottom variant="d2">
            Report illegal content
          </Heading>
          <Text variant="bodyL">
            Fill out the report below to notify Wish of suspected illegal
            product listings on the platform. Our team will review your report
            and take appropriate action. We’ll send you email notifications with
            updates on your report.
          </Text>
        </Box>
        <NoticeIntakeForm />
      </Container>
    </PageRoot>
  );
};

export default NoticeIntakePage;
