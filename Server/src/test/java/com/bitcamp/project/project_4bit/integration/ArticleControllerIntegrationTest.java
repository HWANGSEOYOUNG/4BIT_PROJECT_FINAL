package com.bitcamp.project.project_4bit.integration;

import com.bitcamp.project.project_4bit.Project4bitApplication;
import com.bitcamp.project.project_4bit.config.*;
import com.bitcamp.project.project_4bit.entity.Article;
import com.bitcamp.project.project_4bit.entity.BoardTypeList;
import com.bitcamp.project.project_4bit.repository.BoardTypeListRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Project4bitApplication.class)
@ContextConfiguration(classes = {
        Project4bitApplication.class,
        AuthorizationServerConfig.class,
        JpaPersistenceConfig.class,
        MethodSecurityConfig.class,
        ResourceServerConfig.class,
        WebSecurityConfig.class
})
@WebAppConfiguration
public class ArticleControllerIntegrationTest {

    private static final String CLIENT_ID = "762f6bbb-a257-11e9-9b39-0242ac120002";
    private static final String CLIENT_SECRET = "c16b2a8b36678a7440caeda356534ef2fa75699098bb7d58d499541024e53a51";

    private static final String USERNAME = "test_s";
    private static final String PASSWORD = "1234";

    @Autowired
    FilterChainProxy springSecurityFilterChain;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private BoardTypeListRepository boardTypeListRepository;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .addFilter(springSecurityFilterChain)
                .build();
    }

    /*
     * converts a Java object into JSON representation
     */
    private String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String obtainClientToken() throws Exception {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "client_credentials");

        ResultActions result = mockMvc.perform(
                post("/oauth/token")
                        .params(params)
                        .with(httpBasic(CLIENT_ID, CLIENT_SECRET))
                        .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

        String resultString = result.andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        return jsonParser.parseMap(resultString).get("access_token").toString();
    }

    private String obtainPasswordToken(String username, String password) throws Exception {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "password");
        params.add("username", username);
        params.add("password", password);

        ResultActions result = mockMvc.perform(
                post("/oauth/token")
                        .params(params)
                        .with(httpBasic(CLIENT_ID, CLIENT_SECRET))
                        .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

        String resultString = result.andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        return jsonParser.parseMap(resultString).get("access_token").toString();
    }

    @Test
    @Transactional
    public void testCreateArticle() throws Exception {
        String accessToken = obtainPasswordToken(USERNAME, PASSWORD);
        Assert.assertNotNull(accessToken);

        Article article = new Article();
        article.setArticleContents("Article Content");
        BoardTypeList boardTypeList = boardTypeListRepository.findByBoardId("class_1_board");
        article.setBoardTypeList(boardTypeList);


//        article.setCompleted(false);

        ResultActions result = mockMvc.perform(
                post("/todo")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .content(asJsonString(article))
                        .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

        String resultString = result.andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        Map<String, Object> map =  jsonParser.parseMap(resultString);
//        Assert.assertEquals(map.get("content").toString(), "Todo Content");
        Assert.assertEquals(map.get("articleContents").toString(), "Article Content");
        // articleContents = 자바에서 매핑한 엔티티명
    }
}
