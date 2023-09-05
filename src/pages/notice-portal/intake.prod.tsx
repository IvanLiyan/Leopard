import { NextPage } from "next";
import { Container, Box, Text, Heading } from "@ContextLogic/atlas-ui";
import NoticeIntakeForm from "src/app/notice-portal/components/NoticeIntakeForm";
import PageRoot from "@core/components/PageRoot";

const NoticeIntakePage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <Container sx={{ mt: 5, pb: 5 }}>
        <Box sx={{ mb: 5 }}>
          <Heading gutterBottom variant="d2">
            Report Illegal Content
          </Heading>
          <Text variant="bodyL">
            Fill out the report below to notify Wish of any type of illegal
            product listings on the platform. Our admins will review your notice
            and take appriopriate action against each notified product. You will
            recieve email commuincation to keep you updated with the progress of
            your notice.
          </Text>
        </Box>
        <NoticeIntakeForm />
      </Container>
    </PageRoot>
  );
};

export default NoticeIntakePage;
