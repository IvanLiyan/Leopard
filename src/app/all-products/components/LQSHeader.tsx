import React from "react";
import {
  Button,
  Card,
  Heading,
  Icon,
  Stack,
  Text,
  Tooltip,
} from "@ContextLogic/atlas-ui";
import Markdown from "@core/components/Markdown";
import { VeryRelaxedSidePadding } from "@core/components/PageGuide";
import { useTheme } from "@core/stores/ThemeStore";
import { gql } from "@gql";
import { useQuery } from "@apollo/client";
import Skeleton from "@core/components/Skeleton";

export const GetListingQualityInsightsUrlQuery = gql(`
  query GetListingQualityInsightsUrlQuery {
    listingQualityInsights {
        report {
          presignedS3Url
        }
    }
  }
`);

const LQSHeader: React.FC = () => {
  const { surfaceLightest, textDark } = useTheme();
  const learnMoreLink = "/"; // TBD
  const description =
    i`Reports are generated every 24 hours, but may take up to 48 hours to appear. ` +
    i`[Learn more](${learnMoreLink})`;

  const { data, loading } = useQuery(GetListingQualityInsightsUrlQuery);
  const reportUrl = data?.listingQualityInsights?.report?.presignedS3Url;
  const disabled = reportUrl == null || reportUrl.length === 0;

  if (loading) {
    return <Skeleton height={200} />;
  }

  return (
    <Stack
      direction="column"
      sx={{
        paddingX: VeryRelaxedSidePadding,
        paddingY: "20px",
        gap: "8px",
        backgroundColor: surfaceLightest,
      }}
    >
      <Heading variant="h2">Listing Quality Insights</Heading>
      <Markdown>{description}</Markdown>
      <Card sx={{ padding: "20px" }}>
        <Stack direction="row" alignItems="flex-start" sx={{ gap: "8px" }}>
          <Icon name="doc" color={textDark} />
          <Stack direction="column" sx={{ gap: "8px" }}>
            <Text sx={{ color: textDark }} variant="bodyMStrong">
              Download your Listing Quality Insights report
            </Text>
            <Text sx={{ color: textDark }} variant="bodyM">
              The listing insight report shows how your listings compare to
              other sellers&apos; on Wish. It also includes suggestions on how
              to improve listings to potentially gain more impressions and
              sales.
            </Text>
            <Tooltip
              style={{ alignSelf: "flex-start" }}
              title={
                disabled ? i`Reports are currently unavailable.` : undefined
              }
            >
              {/* excess div required since Mui disables tooltips wrapping disabled buttons */}
              <div>
                <Button
                  secondary
                  href={!disabled ? reportUrl : undefined}
                  disabled={disabled}
                >
                  Download as XSLX
                </Button>
              </div>
            </Tooltip>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default LQSHeader;
