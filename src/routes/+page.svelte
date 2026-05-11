<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";

  import { Search } from "lucide-svelte";

  import {
    FieldGroup,
    FieldSet,
    FieldLegend,
    FieldDescription,
    Field,
    FieldLabel,
    FieldError
  } from "$lib/components/ui/field/index";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as InputGroup from "$lib/components/ui/input-group/index";
  import Button from "$lib/components/ui/button/button.svelte";

  type Props = {
    form: any;
    data: {
      cities: { name: string }[];
    };
  };
  let { form, data }: Props = $props();

  let name = $state((() => form?.name ?? "")());
  let nameChars = $derived(name.length);

  let query = $state("");
  let searchResults = $derived.by(() => {
    if (browser && query.length > 0) {
      return data.cities.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      );
    } else {
      return form?.searchResults ?? [];
    }
  });
</script>

<form
  method="POST"
  class="w-80 mx-auto mt-20"
  use:enhance={() => {
    return ({ update }) => update({ reset: false });
  }}
>
  <FieldGroup>
    <FieldSet>
      <FieldLegend>Order details</FieldLegend>
      <FieldDescription
        >Please fill in the order details below</FieldDescription
      >

      <FieldGroup>
        <Field>
          <FieldLabel for="name">Name</FieldLabel>
          <InputGroup.Root>
            <InputGroup.Input 
              id="name"
              name="name"
              placeholder="Mary Poppins"
              required
              maxlength={25}
              bind:value={name}
            />
            {#if browser}
              <InputGroup.Addon align="inline-end">
                <InputGroup.Text>{25 - nameChars}</InputGroup.Text>
              </InputGroup.Addon>
            {/if}
          </InputGroup.Root>
        </Field>

        <Field>
          <FieldLabel for="address">Address</FieldLabel>
          <Input
            id="address"
            name="address"
            placeholder="19 North Rd"
            required
            value={form?.address ?? ""}
          />
        </Field>

        <Field>
          <FieldLabel for="postcode">Postcode</FieldLabel>
          <Input
            id="postcode"
            name="postcode"
            placeholder="90580"
            required
            value={form?.postcode ?? ""}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel for="query">City search</FieldLabel>
          <InputGroup.Root>
            <InputGroup.Input
              id="query"
              name="query"
              placeholder="Helsinki"
              autocomplete="off"
              bind:value={query}
            />
            <InputGroup.Addon align="inline-end">
              <InputGroup.Button type="submit" formaction="?/search">
                Search
                <Search />
              </InputGroup.Button>
            </InputGroup.Addon>
          </InputGroup.Root>
        </Field>
        {#if searchResults.length}
          <Field>
            <ul class="flex flex-wrap gap-1">
              {#each searchResults as city}
                <li>
                  <Button
                    type="submit"
                    name="cityToSelect"
                    value={city.name}
                    formaction="?/selectCity"
                    variant="outline"
                  >
                    {city.name}
                  </Button>
                </li>
              {/each}
            </ul>
          </Field>
        {/if}
        {#if form?.currentlySelectedCity}
          <Field>
            <FieldDescription>Selected city</FieldDescription>
            <h3>{form.currentlySelectedCity}</h3>
            <input
              type="hidden"
              name="currentlySelectedCity"
              value={form.currentlySelectedCity}
            />
          </Field>
        {/if}
      </FieldGroup>
    </FieldSet>

    <Button type="submit" formaction="?/create" variant="secondary">
      Place order
    </Button>
  </FieldGroup>
</form>
