import { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormGroupProps,
} from "@mui/material";
import { Box, Button, Text, TextField } from "@ContextLogic/atlas-ui";
import SecureFileInput, {
  Attachment,
  SecureFileInputProps,
} from "@core/components/SecureFileInput";
import { ci18n, i18n } from "@core/toolkit/i18n";
import { useToastStore } from "@core/stores/ToastStore";
import {
  CREATE_NOTICE_MUTATION,
  CreateNoticeMutationVariables,
  CreateNoticeMutationResponse,
} from "../api/noticeIntakeForm";

const NoticeIntakeForm: React.FC = () => {
  const toast = useToastStore();
  const [description, setDescription] = useState<string>("");
  const [wishUrls, setWishUrls] = useState<string[]>([]);
  const [wishUrlError, setWishUrlError] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const [files, setFiles] = useState<ReadonlyArray<Attachment>>([]);
  const [createNotice, { loading }] = useMutation<
    CreateNoticeMutationResponse,
    CreateNoticeMutationVariables
  >(CREATE_NOTICE_MUTATION);

  const baseFormGroupProps: FormGroupProps = {
    sx: {
      mb: 3,
    },
  };

  const fileInputProps: SecureFileInputProps = {
    accepts: ".pdf,.jpeg,.jpg,.png",
    maxSizeMB: 50,
    maxAttachments: 5,
    bucket: "TEMP_UPLOADS_V2",
    attachments: files,
    onAttachmentsChanged: setFiles,
    disabled: loading,
  };

  const resetForm = () => {
    setDescription("");
    setWishUrls([]);
    setName("");
    setOrganization("");
    setEmail("");
    setChecked(false);
    setFiles([]);
  };

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
  const wishUrlRegex = /^https:\/\/www.wish.com\/(c|product)\/[a-f\d]{24}$/;

  const canSubmit = () => {
    if (!email.match(emailRegex)) {
      return false;
    }

    for (const url of wishUrls) {
      if (!url.match(wishUrlRegex)) {
        return false;
      }
    }

    return description && wishUrls.length && name && email && checked;
  };

  const onSubmit = async () => {
    const inputArgs: CreateNoticeMutationVariables = {
      input: {
        description: description,
        notifierEmail: email,
        notifierOrganization:
          organization.length > 0 ? organization : undefined,
        notifierName: name,
        productIds: wishUrls.map((url) => url.trim().split("/").pop() || ""),
        supportFiles: files.map((file) => {
          return {
            fileName: file.fileName,
            url: file.url,
          };
        }),
      },
    };

    const { data, errors } = await createNotice({ variables: inputArgs });
    if (errors?.length || data == null) {
      toast.error(ci18n("error message", "Something went wrong"));
      return;
    }

    const {
      dsa: {
        public: {
          createNotice: { ok, message },
        },
      },
    } = data;

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.positive(
      ci18n("creation of notice is successfull", "Notice created successfully"),
    );
    resetForm();
  };

  const handleWishUrlsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const urls = e.target.value.split("\n");
    for (const url of urls) {
      if (!url.match(wishUrlRegex)) {
        setWishUrlError(true);
        setWishUrls(urls);
        return;
      }
    }
    setWishUrlError(false);
    setWishUrls(urls);
  };

  return (
    <Box sx={{ maxWidth: "700px" }}>
      <FormGroup {...baseFormGroupProps}>
        <Text variant="bodyL">{i18n("Description of content *")}</Text>
        <Text sx={{ color: "text.secondary" }}>
          {i18n("Explain why you believe these listings may be illegal")}
        </Text>
        <TextField
          multiline
          fullWidth
          required
          placeholder={i18n("Description of content")}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>
      <FormGroup {...baseFormGroupProps}>
        <Text variant="bodyL">{ci18n("Web URLs on the internet", "URLs")}</Text>
        <Text sx={{ color: "text.secondary" }}>
          {i18n(
            "Add the Wish URLs you are reporting. Separate multiple URLs with newlines",
          )}
        </Text>
        <TextField
          multiline
          fullWidth
          required
          placeholder={ci18n("Web URLs on the internet", "URLs")}
          rows={4}
          value={wishUrls.join("\n")}
          onChange={handleWishUrlsChange}
          helperText={i18n(
            "Must be of the format https://www.wish.com/c/<product_id> or https://www.wish.com/product/<product_id>",
          )}
          error={wishUrls.length != 0 && wishUrlError}
        />
      </FormGroup>
      <FormGroup {...baseFormGroupProps}>
        <Text variant="bodyL">{ci18n("Name of the person", "Name *")}</Text>
        <TextField
          fullWidth
          required
          placeholder={ci18n("Name of the person", "Name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>
      <FormGroup {...baseFormGroupProps}>
        <Text variant="bodyL">
          {ci18n(
            "The group or company they're associated with",
            "Organization",
          )}
        </Text>
        <TextField
          fullWidth
          required
          placeholder={ci18n(
            "The group or company they're associated with",
            "Organization",
          )}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </FormGroup>
      <FormGroup {...baseFormGroupProps}>
        <Text variant="bodyL">{ci18n("Email address", "Email address *")}</Text>
        <Text sx={{ color: "text.secondary" }}>
          {i18n(
            "Trusted flaggers: use your trusted flagger email to prioritize your report",
          )}
        </Text>
        <TextField
          fullWidth
          required
          placeholder={ci18n("Email address", "Email address")}
          value={email}
          error={!email.match(emailRegex) && email != ""}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup {...baseFormGroupProps}>
        <Text variant="bodyL">Upload documents</Text>
        <Text sx={{ color: "text.secondary" }}>
          {i18n("You can upload up to 5 supporting documents")}
        </Text>
        <SecureFileInput {...fileInputProps} />
      </FormGroup>
      <FormGroup {...baseFormGroupProps}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          }
          label={i18n(
            "I confirm that the provided information is accurate and complete.",
          )}
        />
      </FormGroup>
      <FormGroup {...baseFormGroupProps} sx={{ width: 100 }}>
        <Button
          size="large"
          disableRipple
          disableElevation
          sx={{ borderRadius: 10, textTransform: "capitalize" }}
          disabled={!canSubmit() || loading}
          onClick={() => {
            void onSubmit();
          }}
        >
          {ci18n("Submission to complete action", "Submit")}
        </Button>
      </FormGroup>
    </Box>
  );
};

export default NoticeIntakeForm;
